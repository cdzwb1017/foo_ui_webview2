# fb.dnd 拖放

本页是 `fb.dnd` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### registerDropZone(options)

签名：`fb.dnd.registerDropZone(options: DndRegisterDropZoneParams): Promise<{ zoneId: string }>`

注册拖放区域。选项包含 CSS `selector`、可选的 `accept` 字符串数组和事件名；事件名默认是 `dnd:drop`。

```javascript
const { zoneId } = await fb.dnd.registerDropZone({
	selector: '#playlist-drop-zone',
	accept: ['.flac', '.mp3'],
	event: 'dnd:drop'
});
```

### unregisterDropZone(zoneId)

签名：`fb.dnd.unregisterDropZone(zoneId: string): Promise<BaseResponse & { script?: string }>`

移除先前注册的拖放区域。

### getDropZones()

签名：`fb.dnd.getDropZones(): Promise<DndGetDropZonesResponse>`

返回 `{ zones, count }`；每个区域包含 `id`、`selector`、`accept` 与 `event`。

### startDrag()

签名：`fb.dnd.startDrag(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `dnd.startDrag` 调用结果。

```javascript
const result = await fb.dnd.startDrag();
```

<!-- END AUTO-GENERATED SDK STUBS -->
