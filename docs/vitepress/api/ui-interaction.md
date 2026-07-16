# Ui Interaction API

English API reference for the `dnd`, `keyboard`, `ui` family.

This page is the primary owner for the namespaces listed below. Method names, parameter keys, and return fields follow the C++ `RegisterApi` handlers.

## dnd

### dnd.getDropZones

Public API method. Runtime authority: `src/api/DndApi.cpp:290`.

_No parameters._

**Returns**: `{"count":"...","success":true,"zones":"..."}`

```js
const result = await fb2k.invoke('dnd.getDropZones');
```

### dnd.registerDropZone

Public API method. Runtime authority: `src/api/DndApi.cpp:281`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `accept` | `array` | No | Optional; default omitted. |
| `event` | `string` | No | Optional; default dnd:drop. |
| `selector` | `string` | No | Optional; default . |

**Returns**: `{"accept":"...","error":"...","event":"...","script":"...","selector":"...","success":true,"zoneId":"..."}`

```js
const result = await fb2k.invoke('dnd.registerDropZone', { accept: /* value */, event: /* value */, selector: /* value */ });
```

### dnd.startDrag

Public API method. Runtime authority: `src/api/DndApi.cpp:287`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `data` | `string` | No | Optional; default . |
| `paths` | `array` | Yes | Required. |
| `type` | `string` | No | Optional; default text. |

**Returns**: `{"error":"...","note":"...","success":true,"trackCount":"...","type":"..."}`

```js
const result = await fb2k.invoke('dnd.startDrag', { data: /* value */, paths: /* value */, type: /* value */ });
```

### dnd.unregisterDropZone

Public API method. Runtime authority: `src/api/DndApi.cpp:284`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `zoneId` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","script":"...","success":true,"zoneId":"..."}`

```js
const result = await fb2k.invoke('dnd.unregisterDropZone', { zoneId: /* value */ });
```

## keyboard

### keyboard.getRegisteredHotkeys

Public API method. Runtime authority: `src/api/KeyboardApi.cpp:383`.

_No parameters._

**Returns**: `{"hotkeys":"...","success":true}`

```js
const result = await fb2k.invoke('keyboard.getRegisteredHotkeys');
```

### keyboard.registerHotkey

Public API method. Runtime authority: `src/api/KeyboardApi.cpp:374`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `action` | `string` | No | Optional; default . |
| `global` | `boolean` | No | Optional; default true. |
| `key` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","id":"...","success":true}`

```js
const result = await fb2k.invoke('keyboard.registerHotkey', { action: /* value */, global: /* value */, key: /* value */ });
```

### keyboard.registerShortcut

Public API method. Runtime authority: `src/api/KeyboardApi.cpp:377`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `action` | `string` | No | Optional; default . |
| `key` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('keyboard.registerShortcut', { action: /* value */, key: /* value */ });
```

### keyboard.unregisterHotkey

Public API method. Runtime authority: `src/api/KeyboardApi.cpp:380`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | No | Optional; default omitted. |
| `key` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('keyboard.unregisterHotkey', { id: /* value */, key: /* value */ });
```

## ui

### ui.hideNotification

Public API method. Runtime authority: `src/api/UiApi.cpp:343`.

_No parameters._

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('ui.hideNotification');
```

### ui.showContextMenu

Public API method. Runtime authority: `src/api/WindowApi.cpp:2424`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `x` | `integer` | No | Optional; default -1. |
| `y` | `integer` | No | Optional; default -1. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('ui.showContextMenu', { x: /* value */, y: /* value */ });
```

### ui.showCustomMenu

Public API method. Runtime authority: `src/api/UiApi.cpp:334`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `h` | `integer` | No | Optional; default 0. |
| `items` | `array` | Yes | Required. |
| `suppressDefault` | `boolean` | No | Optional; default false. |
| `w` | `integer` | No | Optional; default 0. |
| `x` | `integer` | No | Optional; default 0. |
| `y` | `integer` | No | Optional; default 0. |

**Returns**: `{"error":"...","selectedId":"...","success":true}`

```js
const result = await fb2k.invoke('ui.showCustomMenu', { h: /* value */, items: /* value */, suppressDefault: /* value */, w: /* value */, x: /* value */, y: /* value */ });
```

### ui.showNotification

Public API method. Runtime authority: `src/api/UiApi.cpp:340`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `body` | `string` | No | Optional; default . |
| `silent` | `boolean` | No | Optional; default false. |
| `timeout` | `integer` | No | Optional; default 5000. |
| `title` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","id":"...","success":true}`

```js
const result = await fb2k.invoke('ui.showNotification', { body: /* value */, silent: /* value */, timeout: /* value */, title: /* value */ });
```

### ui.showToast

Public API method. Runtime authority: `src/api/UiApi.cpp:337`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `duration` | `integer` | No | Optional; default 3000. |
| `message` | `string` | No | Optional; default . |
| `position` | `string` | No | Optional; default bottom-right. |
| `type` | `string` | No | Optional; default info. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('ui.showToast', { duration: /* value */, message: /* value */, position: /* value */, type: /* value */ });
```

## Interaction delivery and limitations

`ui.showCustomMenu` uses the current cursor position for native placement and
routes `ui:menuItemClicked` only to the caller. A dismissed menu returns a
successful result with `selectedId: null`. `ui.showToast` does not paint UI in
native code; it emits `ui:toast` to the caller, so the theme owns rendering.

`keyboard.registerHotkey` registers a Windows hotkey and later routes
`keyboard:hotkey` to the window that registered it. `registerShortcut` only
stores an application-local shortcut. Both registration methods require a
non-empty `key` and `action`; `unregisterHotkey` accepts either the numeric
`id` or the original key string.

`dnd.registerDropZone` returns a script that the page must apply to its own
DOM. Its default callback is `dnd:drop`; the callback payload contains the
zone ID plus file metadata, plain text, and HTML data. `dnd.startDrag` reports
the current native limitation for track and file drags rather than implementing
an OLE drag source.
