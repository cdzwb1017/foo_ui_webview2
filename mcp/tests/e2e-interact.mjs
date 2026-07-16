import CDP from "chrome-remote-interface";

const targets = await CDP.List({ port: 9222 });
const page = targets.find(
    (t) => t.type === "page" && !t.url.startsWith("devtools://")
);
const client = await CDP({ port: 9222, target: page });
const { Runtime } = client;

// 获取当前播放曲目
console.log("=== 当前曲目 ===");
const track = await Runtime.evaluate({
    expression:
        'fb2k.invoke("playback.getCurrentTrack").then(r => JSON.stringify(r, null, 2))',
    awaitPromise: true,
    returnByValue: true,
});
console.log(track.result.value);

// 点击播放 (playPause)
console.log("\n=== 调用 playback.playPause ===");
const pp = await Runtime.evaluate({
    expression:
        'fb2k.invoke("playback.playPause").then(r => JSON.stringify(r))',
    awaitPromise: true,
    returnByValue: true,
});
console.log("结果:", pp.result.value);

// 获取状态确认
const state = await Runtime.evaluate({
    expression:
        'fb2k.invoke("playback.getState").then(r => JSON.stringify(r))',
    awaitPromise: true,
    returnByValue: true,
});
console.log("播放状态:", state.result.value);

await client.close();
