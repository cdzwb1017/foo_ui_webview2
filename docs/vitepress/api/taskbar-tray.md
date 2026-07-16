# Taskbar Tray API

English API reference for the `taskbar`, `tray` family.

This page is the primary owner for the namespaces listed below. Method names, parameter keys, and return fields follow the C++ `RegisterApi` handlers.

## taskbar

### taskbar.flash

Public API method. Runtime authority: `src/api/TaskbarApi.cpp:180`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | integer | No | Default: `3`. |
| `interval` | integer | No | Default: `0`. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('taskbar.flash', { count: /* value */, interval: /* value */ });
```

### taskbar.setOverlayIcon

Public API method. Runtime authority: `src/api/TaskbarApi.cpp:179`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `description` | string | No | Optional; the handler reads this field only when it is supplied. |
| `icon` | string | No | Optional base64 icon parsed by `ParseIconParam`; empty, `null`, or omitted clears the overlay icon. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('taskbar.setOverlayIcon', { description: /* value */, icon: /* value */ });
```

### taskbar.setProgress

Public API method. Runtime authority: `src/api/TaskbarApi.cpp:178`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `state` | string | No | Default: `none`. |
| `value` | number | No | Optional; the handler reads this field only when it is supplied. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('taskbar.setProgress', { state: /* value */, value: /* value */ });
```
## Runtime lifecycle, menu data, and events

The `taskbar.*` and `tray.*` families require a standalone main window. In a
panel, each handler returns `{ success: false, panelMode: true }`. Create the
icon with `tray.create` before relying on tray visibility, callbacks, or menu
operations. Windows accepts no more than seven thumbnail buttons; a thumbnail
install can also fail before the taskbar initializes its COM integration.

`taskbar.setProgress` accepts `none`, `indeterminate`, `normal`, `error`, or
`paused`. A numeric `value` is consumed only when it is within 0–1. Thumbnail
button activation broadcasts `taskbar:buttonClicked` with `{ id }`.

Tray menus are configured by `tray.setContextMenu` and can subsequently be
updated with `tray.appendMenuItems`, `tray.removeMenuItems`,
`tray.clearMenuItems`, and `tray.setMenuItemState`. `tray:menuItemClicked`
normally contains `{ id }`; rating, slider, and segmented controls also supply
`value`. The icon events are `tray:click` with `{ button, x, y }`,
`tray:doubleClick` with `{ x, y }`, and `tray:beforeContextMenu` with
`{ x, y }`. The last event is asynchronous: changes made by a handler affect a
later menu opening rather than the menu already being constructed.

The menu may use `data:image/...` cover data and optional webview rendering.
For the webview renderer, the configured stylesheet can contain declarations
such as `display:flex`, `flex-direction:column`, and `background:rgba(...)`.
The tray event contract remains `tray:menuItemClicked`; it does not substitute
the unrelated `menu:select` or `menu:dismiss` events.

```js
fb2k.on('taskbar:buttonClicked', ({ id }) => console.log(id));
fb2k.on('tray:click', ({ button, x, y }) => console.log(button, x, y));
fb2k.on('tray:doubleClick', ({ x, y }) => console.log(x, y));
fb2k.on('tray:beforeContextMenu', ({ x, y }) => console.log(x, y));
fb2k.on('tray:menuItemClicked', ({ id, value }) => console.log(id, value));
fb2k.on('playback:stateChanged', () => {});
fb2k.on('playback:time', () => {});
fb2k.on('playback:trackChanged', () => {});
```

### taskbar.setThumbnailButtons

Public API method. Runtime authority: `src/api/TaskbarApi.cpp:176`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `buttons` | array | Yes | Default: `null`. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('taskbar.setThumbnailButtons', { buttons: /* value */ });
```

### taskbar.updateButton

Public API method. Runtime authority: `src/api/TaskbarApi.cpp:177`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | No | Optional; the handler reads this field only when it is supplied. |
| `icon` | string | No | Optional base64 icon parsed by `ParseIconParam`; empty, `null`, or omitted supplies an empty icon value. |
| `id` | string | No | Default: empty string. |
| `tooltip` | string | No | Optional; the handler reads this field only when it is supplied. |
| `visible` | boolean | No | Optional; the handler reads this field only when it is supplied. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('taskbar.updateButton', { enabled: /* value */, icon: /* value */, id: /* value */, tooltip: /* value */, visible: /* value */ });
```

## tray

### tray.appendMenuItems

Public API method. Runtime authority: `src/api/TrayApi.cpp:444`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | Yes | Default: `null`. |
| `position` | string | No | Optional; the handler reads this field only when it is supplied. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('tray.appendMenuItems', { items: /* value */, position: /* value */ });
```

### tray.clearMenuItems

Public API method. Runtime authority: `src/api/TrayApi.cpp:446`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `position` | string | No | Optional; the handler reads this field only when it is supplied. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('tray.clearMenuItems', { position: /* value */ });
```

### tray.create

Public API method. Runtime authority: `src/api/TrayApi.cpp:433`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `icon` | string | No | Optional base64 icon parsed by `ResolveIconParam`; empty, invalid, or omitted falls back to the foobar2000 main icon. |
| `tooltip` | string | No | Default: `foobar2000`. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('tray.create', { icon: /* value */, tooltip: /* value */ });
```

### tray.destroy

Public API method. Runtime authority: `src/api/TrayApi.cpp:434`.

_No parameters._

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('tray.destroy');
```

### tray.getMenuItems

Public API method. Runtime authority: `src/api/TrayApi.cpp:447`.

_No parameters._

**Returns**: `{"items":"...","success":true}`

```js
const result = await fb2k.invoke('tray.getMenuItems');
```

### tray.isVisible

Public API method. Runtime authority: `src/api/TrayApi.cpp:441`.

_No parameters._

**Returns**: `{"success":true,"visible":"..."}`

```js
const result = await fb2k.invoke('tray.isVisible');
```

### tray.removeMenuItems

Public API method. Runtime authority: `src/api/TrayApi.cpp:445`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `ids` | array | Yes | Default: `null`. |

**Returns**: `{"error":"...","removed":"...","success":true}`

```js
const result = await fb2k.invoke('tray.removeMenuItems', { ids: /* value */ });
```

### tray.setCloseToTray

Public API method. Runtime authority: `src/api/TrayApi.cpp:440`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | No | Default: `false`. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('tray.setCloseToTray', { enabled: /* value */ });
```

### tray.setContextMenu

Public API method. Runtime authority: `src/api/TrayApi.cpp:438`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `config` | object | No | Optional; the handler reads this field only when it is supplied. |
| `items` | array | Yes | Default: `null`. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('tray.setContextMenu', { config: /* value */, items: /* value */ });
```

### tray.setIcon

Public API method. Runtime authority: `src/api/TrayApi.cpp:435`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `icon` | string | No | Optional base64 icon parsed by `ResolveIconParam`; empty, invalid, or omitted falls back to the foobar2000 main icon. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('tray.setIcon', { icon: /* value */ });
```

### tray.setMenuItemState

Public API method. Runtime authority: `src/api/TrayApi.cpp:448`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `checked` | boolean | No | Optional; the handler reads this field only when it is supplied. |
| `enabled` | boolean | No | Optional; the handler reads this field only when it is supplied. |
| `id` | string | No | Default: empty string. |

**Returns**: `{"error":"...","found":"...","success":true}`

```js
const result = await fb2k.invoke('tray.setMenuItemState', { checked: /* value */, enabled: /* value */, id: /* value */ });
```

### tray.setMinimizeToTray

Public API method. Runtime authority: `src/api/TrayApi.cpp:439`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | No | Default: `false`. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('tray.setMinimizeToTray', { enabled: /* value */ });
```

### tray.setTooltip

Public API method. Runtime authority: `src/api/TrayApi.cpp:436`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `tooltip` | string | No | Default: empty string. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('tray.setTooltip', { tooltip: /* value */ });
```

### tray.showBalloon

Public API method. Runtime authority: `src/api/TrayApi.cpp:437`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `icon` | string | No | Default: `info`. |
| `message` | string | No | Default: empty string. |
| `title` | string | No | Default: empty string. |

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('tray.showBalloon', { icon: /* value */, message: /* value */, title: /* value */ });
```

## Phase 3 contract supplements

The sections below close public-contract findings from the strict parameter audit without replacing existing explanations.

<!-- phase3-supplement:taskbar.setProgress -->
### Contract supplement: `taskbar.setProgress`

Phase 3 verified contract supplement. Runtime authority: `src/api/TaskbarApi.cpp:178`.

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `state` | `string` | No | `none` | Defined by the current handler. |
| `value` | `number` | No | — | Defined by the current handler. |

#### Return fields

| Field | Type | Optional |
| --- | --- | --- |
| `success` | `boolean` | No |
| `panelMode` | `boolean` | No |

Semantics: omitted optional parameters use handler defaults; failure branches and error fields are defined by this source file.

```js
const result = await fb2k.invoke('taskbar.setProgress', { state: /* value */, value: /* value */ });
```
