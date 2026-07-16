# fb.playcount playcount

`fb.playcount` 读取 `foo_playcount` 提供的播放统计，支持单曲、批量读取和媒体库整体汇总。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### getBatch()

签名：`fb.playcount.getBatch(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `playcount.getBatch` 调用结果。

```javascript
const result = await fb.playcount.getBatch();
```

### getStats()

签名：`fb.playcount.getStats(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `playcount.getStats` 调用结果。

```javascript
const result = await fb.playcount.getStats();
```

### set()

签名：`fb.playcount.set(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `playcount.set` 调用结果。该方法已弃用：宿主不支持直接修改播放次数，固定返回 `{ success: false }`，且不会应用 `count` 参数。评分应使用 `fb.rating.set()`，播放次数则由实际播放更新。

```javascript
const result = await fb.playcount.set();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## 读取单曲统计

`fb.playcount.get(path: string): Promise<PlaycountInfo | null>` 使用 `paths: [path]` 调用已注册的 `playcount.get` handler，并解包第一项结果。宿主返回空或失败信封时，该方法解析为 `null`。

```javascript
const info = await fb.playcount.get('E:\\Music\\song.flac');
if (info?.success) {
	console.log(info.playCount, info.lastPlayed);
}
```
