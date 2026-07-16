# Lyrics API

English API reference for the `lyrics` family.

This page is the primary owner for the namespaces listed below. Method names, parameter keys, and return fields follow the C++ `RegisterApi` handlers.

## lyrics

### lyrics.exists

Public API method. Runtime authority: `src/api/LyricsApi.cpp:625`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","exists":"...","sources":"...","success":true}`

```js
const result = await fb2k.invoke('lyrics.exists', { path: /* value */ });
```

### lyrics.get

Public API method. Runtime authority: `src/api/LyricsApi.cpp:619`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `format` | `string` | No | Optional; default any. |
| `path` | `string` | No | Optional; default . |
| `source` | `string` | No | Optional; default any. |
| `type` | `string` | No | Optional; default any. |

**Returns**: `{"available":true,"lyrics":"...","path":"...","source":"...","sourcePath":"...","success":true,"synced":"..."}`

```js
const result = await fb2k.invoke('lyrics.get', { format: /* value */, path: /* value */, source: /* value */, type: /* value */ });
```

### lyrics.save

Public API method. Runtime authority: `src/api/LyricsApi.cpp:622`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `filename` | `string` | No | Optional; default . |
| `format` | `string` | No | Optional; default lrc. |
| `lyrics` | `string` | No | Optional; default . |
| `path` | `string` | No | Optional; default . |
| `tagName` | `string` | No | Optional; default LYRICS. |
| `target` | `array` | No | Optional; default file. |

**Returns**: `{"error":"...","results":"...","success":true}`

```js
const result = await fb2k.invoke('lyrics.save', { filename: /* value */, format: /* value */, lyrics: /* value */, path: /* value */, tagName: /* value */, target: /* value */ });
```

## Contract notes

- `lyrics.get` uses `path` when supplied and otherwise resolves the current playing track. `source`, `type`, and `format` default to `any`; successful results include `success`, `available`, and `path`, plus `source`, `lyrics`, and `synced` when lyrics are found. File-backed results additionally include `sourcePath`.
- For a `path|subsong:N` container path, file lookup checks the per-track sidecar before the shared sidecar. `lyrics.exists` returns source labels such as `file:song.lrc` and never treats a missing `path` as a current-track request.
- `lyrics.save` requires both `path` and non-empty `lyrics`. `target` defaults to `file` and accepts `file`, `embedded`, `config`, `all`, or an array of the first three values. The `filename` value must be a plain filename; path separators and traversal sequences are rejected.
- The documented SDK helpers `fb.lyrics.get(...)`, `fb.lyrics.exists(...)`, and `fb.lyrics.save(...)` are convenience wrappers. The public Bridge contract on this page remains the three `lyrics.*` methods. The `<fb-lyrics-panel>` component is a consumer, not a registered API method.
