# Playcount API

English API reference for the `playcount` family.

This page is the primary owner for the namespaces listed below. Method names, parameter keys, and return fields follow the C++ `RegisterApi` handlers.

## playcount

### playcount.get

Public API method. Runtime authority: `src/api/PlaycountApi.cpp:251`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `paths` | `array` | Yes | Required. |

**Returns**: `{"count":"...","error":"...","results":"...","success":true}`

```js
const result = await fb2k.invoke('playcount.get', { paths: /* value */ });
```

### playcount.getBatch

Public API method. Runtime authority: `src/api/PlaycountApi.cpp:254`.

Alias of `playcount.get`; the handler forwards the same public payload.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `paths` | `array` | Yes | Required file path list. Entries may use `path|subsong:N`. |

**Returns**: `{"count":0,"error":"...","results":[],"success":true}`

```js
const result = await fb2k.invoke('playcount.getBatch', { paths: ['C:\\Music\\song.flac'] });
```

### playcount.getStats

Public API method. Runtime authority: `src/api/PlaycountApi.cpp:260`.

_No parameters._

**Returns**: `{"averagePlayCount":"...","averageRating":"...","error":"...","maxPlayCount":"...","playedTracks":"...","ratedTracks":"...","success":true,"totalPlayCount":"...","totalTracks":"...","unplayedTracks":"..."}`

```js
const result = await fb2k.invoke('playcount.getStats');
```

### playcount.set

Public API method. Runtime authority: `src/api/PlaycountApi.cpp:257`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | `string` | Yes | Required. |

**Returns**: `{"error":"...","success":true}`

```js
const result = await fb2k.invoke('playcount.set', { path: /* value */ });
```

## Contract notes

- `playcount.get` and `playcount.getBatch` require a `paths` array. Each valid result contains its original `path`, `success`, `playCount`, and `inLibrary`; `firstPlayed`, `lastPlayed`, `added`, and `rating` are included only when foo_playcount provides usable values.
- Input paths may use `path|subsong:N`. The handler resolves the file path and subsong separately, then preserves the original path in the corresponding result item.
- `playcount.set` requires `path` but is intentionally a placeholder: it always returns `success: false` with the instruction to use `rating.set` for ratings. It does not change play counts.
- `playcount.getStats` has no parameters and returns `{ success, totalTracks, playedTracks, unplayedTracks, ratedTracks, totalPlayCount, maxPlayCount, averagePlayCount, averageRating }`.
