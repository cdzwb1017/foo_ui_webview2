# fb.panel panel

本页是 `fb.panel` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### getConfig()

签名：`fb.panel.getConfig(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `panel.getConfig` 调用结果。

```javascript
const result = await fb.panel.getConfig();
```

### setConfig()

签名：`fb.panel.setConfig(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `panel.setConfig` 调用结果。

```javascript
const result = await fb.panel.setConfig();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## 事件

面板生命周期与配置变化使用 `panel:*` 事件族，并通过 `fb.on()` 订阅：

- `panel:configChanged` — `PanelConfigChangedPayload`
- `panel:focus` 与 `panel:blur` — payload 为 `{ windowId }`
- `panel:initialized` — payload 为 `{ mode, panelMode, windowId }`
- `panel:visibilityChanged` — payload 为 `{ visible }`

```javascript
const off = fb.on('panel:configChanged', (config) => {
	console.log(config.panelName, config.transparentBackground);
});

off();
```
