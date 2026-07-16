# fb.keyboard keyboard

本页是 `fb.keyboard` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### getRegisteredHotkeys()

签名：`fb.keyboard.getRegisteredHotkeys(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `keyboard.getRegisteredHotkeys` 调用结果。

```javascript
const result = await fb.keyboard.getRegisteredHotkeys();
```

### registerShortcut()

签名：`fb.keyboard.registerShortcut(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `keyboard.registerShortcut` 调用结果。

```javascript
const result = await fb.keyboard.registerShortcut();
```

### unregisterHotkey()

签名：`fb.keyboard.unregisterHotkey(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `keyboard.unregisterHotkey` 调用结果。

```javascript
const result = await fb.keyboard.unregisterHotkey();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## 注册热键

`fb.keyboard.registerHotkey(key, action, options?)` 调用 `keyboard.registerHotkey`。`options` 的类型是 `Omit<KeyboardRegisterHotkeyParams, 'key' | 'action'>`，可设置 `global`。当前 facade 将可选响应字段 `id` 标为 `string`，而 `getRegisteredHotkeys()` 中每个 `HotkeyInfo.id` 的类型是 `number`。

```javascript
const result = await fb.keyboard.registerHotkey(
	'Ctrl+Shift+P',
	'playPause',
	{ global: true },
);
```

## keyboard:hotkey

已注册热键触发时，`keyboard:hotkey` 携带含 `id`、`key` 与 `action` 的 `KeyboardHotkeyPayload`。

```javascript
const off = fb.on('keyboard:hotkey', ({ id, key, action }) => {
	console.log(id, key, action);
});

off();
```
