# fb.notification 通知

本页是 `fb.notification` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### hide()

签名：`fb.notification.hide(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `ui.hideNotification` 调用结果。

```javascript
const result = await fb.notification.hide();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## 显示系统通知

`fb.notification.show(options: UiShowNotificationParams)` 调用 `ui.showNotification`。选项包括 `title`、`body`、`silent` 和以毫秒为单位的 `timeout`；返回值可能包含通知 `id`。

```javascript
await fb.notification.show({
	title: '媒体库扫描',
	body: '扫描已经完成。',
	timeout: 5000,
});
```

## 显示 Toast

`fb.notification.showToast(options: UiShowToastParams)` 调用 `ui.showToast`，可传入 `message`、`duration`、`type` 和 `position`。

```javascript
await fb.notification.showToast({
	message: '已添加到播放列表',
	type: 'success',
	duration: 3000,
	position: 'bottom-right',
});
```

成功的 Toast 请求可产生类型化的 `ui:toast` 事件，其 payload 为 `UiToastPayload`。

## 显示自定义菜单

`fb.notification.showCustomMenu(options: UiShowCustomMenuParams): Promise<UiShowCustomMenuResponse>` 调用 `ui.showCustomMenu`。返回值中的可选 `selectedId` 是被单击项目的 ID；关闭菜单而未选择时为 `null`。

```javascript
const { selectedId } = await fb.notification.showCustomMenu({
	items: [
		{ id: 'play', label: '播放' },
		{ id: 'queue', label: '加入队列' },
	],
	x: 120,
	y: 80,
	suppressDefault: true,
});
```
