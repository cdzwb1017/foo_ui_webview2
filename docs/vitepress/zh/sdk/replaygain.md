# fb.replaygain replaygain

本页是 `fb.replaygain` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### clear()

签名：`fb.replaygain.clear(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `replaygain.clear` 调用结果。

```javascript
const result = await fb.replaygain.clear();
```

### get()

签名：`fb.replaygain.get(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `replaygain.get` 调用结果。

```javascript
const result = await fb.replaygain.get();
```

### getMode()

签名：`fb.replaygain.getMode(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `replaygain.getMode` 调用结果。

```javascript
const result = await fb.replaygain.getMode();
```

### getPreamp()

签名：`fb.replaygain.getPreamp(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `replaygain.getPreamp` 调用结果。

```javascript
const result = await fb.replaygain.getPreamp();
```

### getSettings()

签名：`fb.replaygain.getSettings(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `replaygain.getSettings` 调用结果，包含来源模式、处理模式、两组前级增益值和启用状态。要启动分析，可调用 `scan(paths, { mode? })`；默认模式为 `'track'`，`'album'` 会将所选曲目视为同一张专辑。

```javascript
const result = await fb.replaygain.getSettings();
await fb.replaygain.scan(['E:\\Music\\one.flac'], { mode: 'track' });
```

### setMode()

签名：`fb.replaygain.setMode(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `replaygain.setMode` 调用结果。

```javascript
const result = await fb.replaygain.setMode();
```

### setPreamp()

签名：`fb.replaygain.setPreamp(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `replaygain.setPreamp` 调用结果。

```javascript
const result = await fb.replaygain.setPreamp();
```

<!-- END AUTO-GENERATED SDK STUBS -->
