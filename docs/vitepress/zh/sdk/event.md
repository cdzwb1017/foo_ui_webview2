# fb.event 跨窗口事件

本页是 `fb.event` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### emit(eventName, payload?, excludeSelf?)

签名：`fb.event.emit(eventName: string, payload?: unknown, excludeSelf?: boolean): Promise<BaseResponse>`

向所有已连接窗口广播事件。将 `excludeSelf` 设为 `true` 可排除发起调用的窗口；默认值为 `false`。

```javascript
await fb.event.emit('theme:accentChanged', { color: '#4cc2ff' }, true);
```

### emitTo()

签名：`fb.event.emitTo(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `event.emitTo` 调用结果。

```javascript
await fb.event.emitTo(
	'theme:focusSearch',
	{ selectAll: true },
	targetWindowId
);
```

<!-- END AUTO-GENERATED SDK STUBS -->
