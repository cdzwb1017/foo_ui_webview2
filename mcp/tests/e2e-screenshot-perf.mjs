/**
 * Screenshot Performance Benchmark
 *
 * Measures CDP connection + screenshot latency.
 * Requires foobar2000 running with CDP on port 9222.
 *
 * Usage: node tests/e2e-screenshot-perf.mjs
 */

import CDP from "chrome-remote-interface";

const PORT = parseInt(process.env.FB2K_CDP_PORT || "9222", 10);
const ITERATIONS = 5;

console.log(`\n=== Screenshot Performance Benchmark ===`);
console.log(`CDP port: ${PORT}, iterations: ${ITERATIONS}\n`);

// --- Phase 1: Cold start (full connection + screenshot) ---
const coldStart = performance.now();

const targets = await CDP.List({ port: PORT });
const listDone = performance.now();

const page = targets.find(
    (t) => t.type === "page" && !t.url.startsWith("devtools://")
);
if (!page) {
    console.error("No page target found. Is foobar2000 running with CDP?");
    process.exit(1);
}
console.log(`Target: ${page.title} (${page.url})`);

const client = await CDP({ port: PORT, target: page });
const wsDone = performance.now();

await Promise.all([
    client.Runtime.enable(),
    client.Page.enable(),
]);
const enableDone = performance.now();

const { data: firstShot } = await client.Page.captureScreenshot({ format: "png" });
const firstShotDone = performance.now();

console.log(`\n--- Cold Start Breakdown ---`);
console.log(`  CDP.List() target discovery : ${(listDone - coldStart).toFixed(1)} ms`);
console.log(`  WebSocket handshake         : ${(wsDone - listDone).toFixed(1)} ms`);
console.log(`  Runtime+Page enable         : ${(enableDone - wsDone).toFixed(1)} ms`);
console.log(`  First screenshot            : ${(firstShotDone - enableDone).toFixed(1)} ms`);
console.log(`  TOTAL cold start            : ${(firstShotDone - coldStart).toFixed(1)} ms`);
console.log(`  Screenshot size             : ${Math.round(firstShot.length * 3 / 4 / 1024)} KB`);

// --- Phase 2: Warm screenshots (connection reused) ---
const warmTimes = [];
for (let i = 0; i < ITERATIONS; i++) {
    const t0 = performance.now();
    await client.Page.captureScreenshot({ format: "png" });
    warmTimes.push(performance.now() - t0);
}

const avg = warmTimes.reduce((a, b) => a + b, 0) / warmTimes.length;
const min = Math.min(...warmTimes);
const max = Math.max(...warmTimes);

console.log(`\n--- Warm Screenshots (${ITERATIONS} iterations) ---`);
warmTimes.forEach((t, i) => console.log(`  #${i + 1}: ${t.toFixed(1)} ms`));
console.log(`  avg: ${avg.toFixed(1)} ms | min: ${min.toFixed(1)} ms | max: ${max.toFixed(1)} ms`);

// --- Phase 3: Full-page screenshot ---
const fpStart = performance.now();
const metrics = await client.Page.getLayoutMetrics();
const { width, height } = metrics.contentSize;
await client.Emulation.setDeviceMetricsOverride({
    width: Math.ceil(width),
    height: Math.ceil(height),
    deviceScaleFactor: 1,
    mobile: false,
});
const { data: fullShot } = await client.Page.captureScreenshot({ format: "png" });
await client.Emulation.clearDeviceMetricsOverride();
const fpDone = performance.now();

console.log(`\n--- Full-Page Screenshot ---`);
console.log(`  Total: ${(fpDone - fpStart).toFixed(1)} ms`);
console.log(`  Size : ${Math.round(fullShot.length * 3 / 4 / 1024)} KB (${Math.ceil(width)}x${Math.ceil(height)})`);

await client.close();

console.log(`\n--- Summary ---`);
console.log(`  Connection overhead (one-time): ${(enableDone - coldStart).toFixed(1)} ms`);
console.log(`  Pre-connect eliminates this from first tool call.`);
console.log(`  Warm screenshot avg: ${avg.toFixed(1)} ms`);
console.log(`\nDone.\n`);
