# fb.jitQueue JIT 即时队列

本页是 `fb.jitQueue` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### getState()

签名：`fb.jitQueue.getState(): Promise<JitQueueStateInfo>`

返回当前队列状态，包括 `isActive`、`state`、`currentTrackId`、`nextTrackId`、`bufferSize` 与 `shadowPlaylist`。

```javascript
const state = await fb.jitQueue.getState();
```

### enqueueNext(opts)

签名：`fb.jitQueue.enqueueNext(opts: JitQueueEnqueueNextParams): Promise<BaseResponse & { bufferSize?: number }>`

将下一项加入自适应播放队列。`opts` 接受 `trackId`、`title` 和 `url`；URL 超过 2048 个字符时返回 `success: false`。

```javascript
await fb.jitQueue.enqueueNext({
	trackId: 'track-42',
	title: '下一首',
	url: 'https://media.example.com/next.flac'
});
```

### playNow(opts)

签名：`fb.jitQueue.playNow(opts: JitQueuePlayNowParams): Promise<BaseResponse & { shadowPlaylist?: number }>`

立即播放指定项目。参数同样包含 `trackId`、`title` 与 `url`，并采用 2048 字符的 URL 上限。

```javascript
await fb.jitQueue.playNow({
	trackId: 'track-41',
	title: '当前曲目',
	url: 'https://media.example.com/current.flac'
});
```

### clear()

签名：`fb.jitQueue.clear(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `jitQueue.clear` 调用结果。

```javascript
const result = await fb.jitQueue.clear();
```

### notifyEmpty()

签名：`fb.jitQueue.notifyEmpty(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `jitQueue.notifyEmpty` 调用结果。

```javascript
const result = await fb.jitQueue.notifyEmpty();
```

### preloadBatch()

签名：`fb.jitQueue.preloadBatch(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `jitQueue.preloadBatch` 调用结果。

```javascript
const result = await fb.jitQueue.preloadBatch();
```

### skip()

签名：`fb.jitQueue.skip(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `jitQueue.skip` 调用结果。

```javascript
const result = await fb.jitQueue.skip();
```

### stop()

签名：`fb.jitQueue.stop(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `jitQueue.stop` 调用结果。

```javascript
const result = await fb.jitQueue.stop();
```

## 事件

通过 `fb.on()` 订阅以下冒号格式事件：

- `jitQueue:needNext` — `{ currentTrackId, reason }`
- `jitQueue:trackChanged` — `{ trackId, title }`
- `jitQueue:listExhausted` — `{ lastTrackId }`
- `jitQueue:preloadComplete` — `{ count, startIndex, replace }`
- `jitQueue:error` — `{ trackId, error, url? }` 或 `{ trackId, error, path? }`

<!-- END AUTO-GENERATED SDK STUBS -->
