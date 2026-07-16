# fb.dnd Drag and Drop

`fb.dnd` registers frontend drop zones and starts host-backed drag operations.

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK Methods

> This block provides SDK-level method coverage and may later be expanded with complete examples and best practices.

### registerDropZone(options)

Signature: `fb.dnd.registerDropZone(options: DndRegisterDropZoneParams): Promise<{ zoneId: string }>`

Registers a drop zone. The options contain a CSS `selector`, an optional `accept` string array, and an event name that defaults to `dnd:drop`.

```javascript
const { zoneId } = await fb.dnd.registerDropZone({
	selector: '#playlist-drop-zone',
	accept: ['.flac', '.mp3'],
	event: 'dnd:drop'
});
```

### unregisterDropZone(zoneId)

Signature: `fb.dnd.unregisterDropZone(zoneId: string): Promise<BaseResponse & { script?: string }>`

Removes a previously registered drop zone.

### getDropZones()

Signature: `fb.dnd.getDropZones(): Promise<DndGetDropZonesResponse>`

Returns `{ zones, count }`. Each zone exposes `id`, `selector`, `accept`, and `event`.

### startDrag(type, options?)

Signature: `fb.dnd.startDrag(type: string, options?: Omit<DndStartDragParams, 'type'>): Promise<BaseResponse & { trackCount?: number; note?: string }>`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `string` | Yes | Drag payload type |
| `options.data` | `string` | No | Text payload |
| `options.paths` | `unknown` | No | Host-recognized path payload |

```javascript
await fb.dnd.startDrag('files', {
	paths: ['C:\\Music\\track.flac']
});
```

<!-- END AUTO-GENERATED SDK STUBS -->
