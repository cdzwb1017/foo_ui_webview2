/**
 * 错误路径与边界情况测试
 *
 * 验证 MCP Server 各层在极端条件下的行为：
 * - CDP 连接中断/拒绝/超时
 * - 畸形响应处理
 * - invoke 参数边界
 * - 并发安全
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── BridgeExecutor 错误路径 ─────────────────

describe("BridgeExecutor 错误路径", () => {
    // 直接测试 BridgeExecutor 对 CdpClient 异常行为的应对
    // 使用手动 mock（不依赖 vi.mock）

    function createMockCdp(overrides: Record<string, any> = {}) {
        return {
            connected: true,
            connect: vi.fn().mockResolvedValue(undefined),
            disconnect: vi.fn().mockResolvedValue(undefined),
            ensureConnected: vi.fn().mockResolvedValue(undefined),
            invoke: vi.fn().mockResolvedValue({ success: true }),
            evaluate: vi.fn().mockResolvedValue(undefined),
            screenshot: vi.fn().mockResolvedValue("base64data"),
            getConsoleMessages: vi.fn().mockResolvedValue([]),
            ...overrides,
        };
    }

    // 动态导入以避免 mock 污染
    async function createExecutor(mockCdp: any) {
        const { BridgeExecutor } = await import("../src/bridge-executor.js");
        return new BridgeExecutor(mockCdp);
    }

    describe("CDP 连接中断", () => {
        it("invoke 时 CDP 连接断开应抛出 Error", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockRejectedValue(
                    new Error("WebSocket is not open: readyState 3 (CLOSED)")
                ),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("playback.play");

            expect(result.success).toBe(false);
            expect(result.error).toMatch(/WebSocket|CLOSED/);
        });

        it("screenshot 在连接断开时返回错误", async () => {
            const mock = createMockCdp({
                screenshot: vi.fn().mockRejectedValue(
                    new Error("Target closed")
                ),
            });
            const executor = await createExecutor(mock);

            await expect(executor.screenshot()).rejects.toThrow("Target closed");
        });
    });

    describe("CDP 连接超时", () => {
        it("invoke 超时应返回超时错误", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockRejectedValue(
                    new Error("invoke timed out after 30000ms")
                ),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("library.search", { query: "test" });

            expect(result.success).toBe(false);
            expect(result.error).toMatch(/timed out/);
        });
    });

    describe("畸形响应", () => {
        it("invoke 返回 undefined 应安全处理", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockResolvedValue(undefined),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("playback.getState");

            expect(result.success).toBe(true);
            // data 可以是 undefined
        });

        it("invoke 返回 null 应安全处理", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockResolvedValue(null),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("playback.getState");

            expect(result.success).toBe(true);
        });

        it("invoke 返回空对象应安全处理", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockResolvedValue({}),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("playback.getState");

            expect(result.success).toBe(true);
            expect(result.data).toEqual({});
        });

        it("invoke 返回原始值 (string) 应安全处理", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockResolvedValue("unexpected string"),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("playback.getState");

            expect(result.success).toBe(true);
            expect(result.data).toBe("unexpected string");
        });

        it("invoke 返回数组应安全处理", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockResolvedValue([1, 2, 3]),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("playlist.getAll");

            expect(result.success).toBe(true);
            expect(result.data).toEqual([1, 2, 3]);
        });

        it("invoke 返回嵌套错误结构应传播", async () => {
            const mock = createMockCdp({
                invoke: vi.fn().mockRejectedValue(
                    new Error("API error: playback.play — Not playing")
                ),
            });
            const executor = await createExecutor(mock);

            const result = await executor.call("playback.play");

            expect(result.success).toBe(false);
            expect(result.error).toMatch(/API error/);
        });
    });

    describe("参数边界", () => {
        it("空方法名应传递到 CDP 层", async () => {
            const mock = createMockCdp();
            const executor = await createExecutor(mock);

            await executor.call("");

            expect(mock.invoke).toHaveBeenCalledWith("", undefined);
        });

        it("超长方法名不应导致崩溃", async () => {
            const mock = createMockCdp();
            const executor = await createExecutor(mock);
            const longMethod = "a".repeat(10000);

            await executor.call(longMethod);

            expect(mock.invoke).toHaveBeenCalledWith(longMethod, undefined);
        });

        it("大参数对象不应崩溃", async () => {
            const mock = createMockCdp();
            const executor = await createExecutor(mock);
            const bigParams: Record<string, string> = {};
            for (let i = 0; i < 1000; i++) {
                bigParams[`key_${i}`] = `value_${i}`;
            }

            await executor.call("test.method", bigParams);

            expect(mock.invoke).toHaveBeenCalledWith("test.method", bigParams);
        });

        it("参数包含特殊字符应安全传递", async () => {
            const mock = createMockCdp();
            const executor = await createExecutor(mock);
            const params = {
                query: "artist:'Bj?rk' AND title:\"Homogenic\" <script>alert('xss')</script>",
            };

            await executor.call("library.search", params);

            expect(mock.invoke).toHaveBeenCalledWith("library.search", params);
        });

        it("参数包含 Unicode 应安全传递", async () => {
            const mock = createMockCdp();
            const executor = await createExecutor(mock);
            const params = {
                query: "谭盾 交响曲 ?",
            };

            await executor.call("library.search", params);

            expect(mock.invoke).toHaveBeenCalledWith("library.search", params);
        });
    });

    describe("evaluate 错误路径", () => {
        it("evaluate 语法错误应传播异常", async () => {
            const mock = createMockCdp({
                evaluate: vi.fn().mockRejectedValue(
                    new Error("JS evaluation error: SyntaxError: Unexpected end of input")
                ),
            });
            const executor = await createExecutor(mock);

            await expect(
                executor.evaluate("function(")
            ).rejects.toThrow(/SyntaxError|evaluation error/);
        });

        it("evaluate 返回 undefined 应安全处理", async () => {
            const mock = createMockCdp({
                evaluate: vi.fn().mockResolvedValue(undefined),
            });
            const executor = await createExecutor(mock);

            const result = await executor.evaluate("void 0");

            expect(result).toBeUndefined();
        });
    });

    describe("getConsoleMessages 边界", () => {
        it("大量日志不应崩溃", async () => {
            const hugeLog = Array.from({ length: 500 }, (_, i) => ({
                level: "log",
                text: `message #${i}`,
            }));
            const mock = createMockCdp({
                getConsoleMessages: vi.fn().mockResolvedValue(hugeLog),
            });
            const executor = await createExecutor(mock);

            const result = await executor.getConsoleMessages();

            expect(result).toHaveLength(500);
        });
    });
});
