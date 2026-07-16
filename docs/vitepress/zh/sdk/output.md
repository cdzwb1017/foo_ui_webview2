# fb.output output

本页是 `fb.output` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### getEntries()

签名：`fb.output.getEntries(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `output.getEntries` 调用结果。

```javascript
const result = await fb.output.getEntries();
```

### getSettings()

签名：`fb.output.getSettings(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `output.getSettings` 调用结果。

```javascript
const result = await fb.output.getSettings();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## 输出设备列表

`fb.output.getDevices(): Promise<OutputDevice[]>` 调用 `output.getDevices`，并解包宿主返回的 `{ devices, count }` 信封。每个设备包含 `id`、`deviceId`、`outputId`、`name` 和 `isCurrent`。

```javascript
const devices = await fb.output.getDevices();
const current = devices.find((device) => device.isCurrent);
```
