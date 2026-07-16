# Discovery API

English API reference for the `discovery` family.

This page is the primary owner for the namespaces listed below. Method names, parameter keys, and return fields follow the C++ `RegisterApi` handlers.

## discovery

### discovery.executeContextMenuByPath

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:860`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | `string` | No | Optional; default . |
| `trackPath` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","foundName":"...","itemCount":"...","path":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.executeContextMenuByPath', { path: /* value */, trackPath: /* value */ });
```

### discovery.executeContextMenuCommand

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:859`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `guid` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","guid":"...","itemCount":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.executeContextMenuCommand', { guid: /* value */ });
```

### discovery.executeMainMenuCommand

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:857`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `guid` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","guid":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.executeMainMenuCommand', { guid: /* value */ });
```

### discovery.getAllServices

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:854`.

_No parameters._

**Returns**: `{"services":[],"success":true,"totalServices":"..."}`

```js
const result = await fb2k.invoke('discovery.getAllServices');
```

### discovery.getComponents

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:863`.

_No parameters._

**Returns**: `{"components":"...","count":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getComponents');
```

### discovery.getContextMenuCommands

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:858`.

_No parameters._

**Returns**: `{"commands":"...","count":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getContextMenuCommands');
```

### discovery.getContextMenuTree

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:861`.

_No parameters._

**Returns**: `{"error":"...","itemCount":"...","success":true,"tree":"..."}`

```js
const result = await fb2k.invoke('discovery.getContextMenuTree');
```

### discovery.getDspEntries

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:865`.

_No parameters._

**Returns**: `{"count":"...","entries":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getDspEntries');
```

### discovery.getInputFormats

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:862`.

_No parameters._

**Returns**: `{"count":"...","fileTypes":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getInputFormats');
```

### discovery.getMainMenuCommands

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:855`.

_No parameters._

**Returns**: `{"commands":"...","count":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getMainMenuCommands');
```

### discovery.getMainMenuGroups

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:856`.

_No parameters._

**Returns**: `{"count":"...","groups":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getMainMenuGroups');
```

### discovery.getOutputDevices

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:866`.

_No parameters._

**Returns**: `{"count":"...","devices":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getOutputDevices');
```

### discovery.getPreferencePages

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:867`.

_No parameters._

**Returns**: `{"count":"...","pages":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getPreferencePages');
```

### discovery.getUIElements

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:864`.

_No parameters._

**Returns**: `{"count":"...","elements":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.getUIElements');
```

### discovery.searchCommands

Public API method. Runtime authority: `src/api/DiscoveryApi.cpp:868`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | `string` | No | Optional; default . |

**Returns**: `{"count":"...","error":"...","query":"...","results":"...","success":true}`

```js
const result = await fb2k.invoke('discovery.searchCommands', { query: /* value */ });
```

## Discovery scope and execution rules

- Results enumerate services registered in the current foobar2000 process; counts and names vary with installed components and host configuration.
- `discovery.executeMainMenuCommand` and `discovery.executeContextMenuCommand` require a valid GUID. A context command applies to the now-playing item when available, otherwise to the active playlist selection.
- `discovery.executeContextMenuByPath` requires `path`; optional `trackPath` is subject to media-read security. Without it, the runtime uses the same now-playing/selection fallback.
- `discovery.getContextMenuTree` is diagnostic output. It requires an active target item, limits recursion to 10 levels and limits each popup to 50 children.
- `discovery.searchCommands` requires a non-empty `query` and performs a case-insensitive match over main-menu command names and descriptions.
