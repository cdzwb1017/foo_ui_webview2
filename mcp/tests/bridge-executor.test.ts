/**
 * BridgeExecutor 单元测试
 *
 * 使用 Mock CdpClient 验证：
 * - call() 正常调用和结果标准化
 * - call() 错误处理
 * - screenshot() 委托
 * - evaluate() 委托
 * - getConsoleMessages() 委托
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { BridgeExecutor } from "../src/bridge-executor.js";
import type { CdpClient } from "../src/cdp-client.js";

// ── Mock CdpClient ──────────────────────────

function createMockCdp(): CdpClient {
    return {
        invoke: vi.fn(),
        evaluate: vi.fn(),
        screenshot: vi.fn(),
        getConsoleMessages: vi.fn(),
        connect: vi.fn(),
        disconnect: vi.fn(),
        ensureConnected: vi.fn(),
        connected: true,
    } as unknown as CdpClient;
}

describe("BridgeExecutor", () => {
    let cdp: ReturnType<typeof createMockCdp>;
    let bridge: BridgeExecutor;

    beforeEach(() => {
        cdp = createMockCdp();
        bridge = new BridgeExecutor(cdp);
    });

    // ── call() ──────────────────────────────

    describe("call()", () => {
        it("正常调用返回 success: true 和 data", async () => {
            const mockResult = { state: "playing", canPause: true };
            vi.mocked(cdp.invoke).mockResolvedValue(mockResult);

            const result = await bridge.call("playback.getState");

            expect(cdp.invoke).toHaveBeenCalledWith("playback.getState", undefined);
            expect(result).toEqual({
                success: true,
                data: mockResult,
            });
        });

        it("带参数调用正确传递 params", async () => {
            vi.mocked(cdp.invoke).mockResolvedValue({ success: true });

            await bridge.call("playback.setPosition", { seconds: 42 });

            expect(cdp.invoke).toHaveBeenCalledWith("playback.setPosition", {
                seconds: 42,
            });
        });

        it("API 返回 null 时 data 为 null", async () => {
            vi.mocked(cdp.invoke).mockResolvedValue(null);

            const result = await bridge.call("playback.stop");

            expect(result).toEqual({
                success: true,
                data: null,
            });
        });

        it("API 返回数组时 data 为数组", async () => {
            const tracks = [
                { title: "Track A", artist: "Artist 1" },
                { title: "Track B", artist: "Artist 2" },
            ];
            vi.mocked(cdp.invoke).mockResolvedValue(tracks);

            const result = await bridge.call("playlist.getTracks", {
                playlist: 0,
                start: 0,
                count: 2,
            });

            expect(result.success).toBe(true);
            expect(result.data).toEqual(tracks);
        });

        it("CDP invoke 抛出 Error 时返回 success: false", async () => {
            vi.mocked(cdp.invoke).mockRejectedValue(
                new Error("fb2k.invoke('playback.play') failed: not connected")
            );

            const result = await bridge.call("playback.play");

            expect(result).toEqual({
                success: false,
                error: "fb2k.invoke('playback.play') failed: not connected",
            });
        });

        it("CDP invoke 抛出非 Error 时也能处理", async () => {
            vi.mocked(cdp.invoke).mockRejectedValue("string error");

            const result = await bridge.call("playback.play");

            expect(result).toEqual({
                success: false,
                error: "string error",
            });
        });

        it("CDP invoke 超时时返回错误", async () => {
            vi.mocked(cdp.invoke).mockRejectedValue(
                new Error("invoke timed out after 30000ms")
            );

            const result = await bridge.call("library.search", { query: "test" });

            expect(result.success).toBe(false);
            expect(result.error).toContain("timed out");
        });
    });

    // ── screenshot() ────────────────────────

    describe("screenshot()", () => {
        it("委托给 cdp.screenshot 并返回 base64", async () => {
            const base64Png = "iVBORw0KGgo...";
            vi.mocked(cdp.screenshot).mockResolvedValue(base64Png);

            const result = await bridge.screenshot({ fullPage: true });

            expect(cdp.screenshot).toHaveBeenCalledWith({ fullPage: true });
            expect(result).toBe(base64Png);
        });

        it("无参数时传递 undefined", async () => {
            vi.mocked(cdp.screenshot).mockResolvedValue("base64data");

            await bridge.screenshot();

            expect(cdp.screenshot).toHaveBeenCalledWith(undefined);
        });

        it("截图失败时抛出错误", async () => {
            vi.mocked(cdp.screenshot).mockRejectedValue(
                new Error("Page.captureScreenshot failed")
            );

            await expect(bridge.screenshot()).rejects.toThrow(
                "Page.captureScreenshot failed"
            );
        });
    });

    // ── evaluate() ──────────────────────────

    describe("evaluate()", () => {
        it("委托给 cdp.evaluate 并返回结果", async () => {
            vi.mocked(cdp.evaluate).mockResolvedValue(42);

            const result = await bridge.evaluate("1 + 41");

            expect(cdp.evaluate).toHaveBeenCalledWith("1 + 41");
            expect(result).toBe(42);
        });

        it("可以返回复杂对象", async () => {
            const obj = { a: 1, b: [2, 3] };
            vi.mocked(cdp.evaluate).mockResolvedValue(obj);

            const result = await bridge.evaluate("({ a: 1, b: [2, 3] })");
            expect(result).toEqual(obj);
        });

        it("JS 执行错误时抛出", async () => {
            vi.mocked(cdp.evaluate).mockRejectedValue(
                new Error("JS evaluation error: ReferenceError: x is not defined")
            );

            await expect(bridge.evaluate("x")).rejects.toThrow(
                "JS evaluation error"
            );
        });
    });

    // ── getConsoleMessages() ────────────────

    describe("getConsoleMessages()", () => {
        it("返回控制台消息数组", async () => {
            const messages = [
                { level: "log", text: "Hello" },
                { level: "error", text: "Something went wrong" },
            ];
            vi.mocked(cdp.getConsoleMessages).mockResolvedValue(messages);

            const result = await bridge.getConsoleMessages();

            expect(result).toEqual(messages);
        });

        it("无消息时返回空数组", async () => {
            vi.mocked(cdp.getConsoleMessages).mockResolvedValue([]);

            const result = await bridge.getConsoleMessages();

            expect(result).toEqual([]);
        });
    });
});
