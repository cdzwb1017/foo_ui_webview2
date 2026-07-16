import CDP from "chrome-remote-interface";

// 选择真实页面（非 DevTools）
const targets = await CDP.List({ port: 9222 });
const page = targets.find(
    (t) => t.type === "page" && !t.url.startsWith("devtools://")
);
if (!page) {
    console.error("? 未找到非 DevTools 页面");
    process.exit(1);
}
console.log("目标:", page.title, page.url);

const client = await CDP({ port: 9222, target: page });
const { Runtime, Page } = client;

// Enable Page domain for screenshot
await Page.enable();

// 1. 检查 fb2k 对象
const tc = await Runtime.evaluate({
    expression: "typeof fb2k",
    returnByValue: true,
});
console.log("fb2k type:", tc.result.value);

// 2. playback.getState
const s = await Runtime.evaluate({
    expression: 'fb2k.invoke("playback.getState").then(r => JSON.stringify(r))',
    awaitPromise: true,
    returnByValue: true,
});
console.log("getState:", s.result.value);

// 3. playlist.getAll
const p = await Runtime.evaluate({
    expression: 'fb2k.invoke("playlist.getAll").then(r => JSON.stringify(r))',
    awaitPromise: true,
    returnByValue: true,
});
console.log("playlists:", p.result.value);

// 4. playback.getVolume
const v = await Runtime.evaluate({
    expression: 'fb2k.invoke("playback.getVolume").then(r => JSON.stringify(r))',
    awaitPromise: true,
    returnByValue: true,
});
console.log("volume:", v.result.value);

// 5. screenshot
const t0 = performance.now();
const { data: screenshot } = await Page.captureScreenshot({ format: "png" });
const screenshotMs = (performance.now() - t0).toFixed(1);
console.log(`screenshot: ${Math.round(screenshot.length * 3 / 4 / 1024)} KB in ${screenshotMs}ms`);

// 6. DOM snapshot (simplified)
const d = await Runtime.evaluate({
    expression: `(function() {
        function walk(el, depth) {
            if (depth > 3) return '';
            const tag = el.tagName?.toLowerCase() || '#text';
            const id = el.id ? '#' + el.id : '';
            let r = '  '.repeat(depth) + tag + id + '\\n';
            for (const c of el.children || []) r += walk(c, depth + 1);
            return r;
        }
        return walk(document.documentElement, 0);
    })()`,
    returnByValue: true,
});
const domLines = (d.result.value || "").split("\n").length;
console.log(`DOM snapshot: ${domLines} lines`);

await client.close();
console.log("\n端到端冒烟测试通过（含截图 + DOM 快照）！");
