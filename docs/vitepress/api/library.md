# Library API

English API reference for the `library` family.

This page is the primary owner for the namespaces listed below. Method names, parameter keys, and return fields follow the C++ `RegisterApi` handlers.

## library

### library.addToPlaylist

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1974`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `paths` | `array` | No | Optional; default []. |
| `playlist` | `integer` | No | Optional; default SIZE_MAX. |

**Returns**: `{"added":"...","error":"...","success":true}`

```js
const result = await fb2k.invoke('library.addToPlaylist', { paths: /* value */, playlist: /* value */ });
```

### library.browseDirectory

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1980`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `includeFiles` | `boolean` | No | Optional; default true. |
| `path` | `string` | No | Optional; default . |

**Returns**: `{"directories":"...","error":"...","files":"...","items":"...","success":true}`

```js
const result = await fb2k.invoke('library.browseDirectory', { includeFiles: /* value */, path: /* value */ });
```

### library.browseTree

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1979`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `includeFiles` | `boolean` | No | Optional; default false. |
| `pathId` | `string` | No | Optional; default . |
| `recursiveFiles` | `boolean` | No | Optional; default false. |
| `rootId` | `string` | Yes | Required. |

**Returns**: `{"files":[]}`

```js
const result = await fb2k.invoke('library.browseTree', { includeFiles: /* value */, pathId: /* value */, recursiveFiles: /* value */, rootId: /* value */ });
```

### library.getAlbumTracks

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1970`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `album` | `string` | No | Optional; default . |
| `artist` | `string` | No | Optional; default . |

**Returns**: `{"album":"...","artist":"...","items":"...","success":true,"total":"...","tracks":"..."}`

```js
const result = await fb2k.invoke('library.getAlbumTracks', { album: /* value */, artist: /* value */ });
```

### library.getAlbums

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1967`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `coverMaxSize` | `integer` | No | Optional; default 500. |
| `includeCover` | `boolean` | No | Optional; default false. |
| `includeTracks` | `boolean` | No | Optional; default false. |
| `limit` | `integer` | No | Optional; default 100. |
| `offset` | `integer` | No | Optional; default 0. |
| `query` | `string` | No | Optional; default . |
| `sort` | `string` | No | Optional; default name. |
| `useCache` | `boolean` | No | Optional; default true. |

**Returns**: `{"albums":[],"fromCache":"...","hasMore":true,"includeCover":"...","limit":"...","offset":"...","success":true,"total":"..."}`

```js
const result = await fb2k.invoke('library.getAlbums', { coverMaxSize: /* value */, includeCover: /* value */, includeTracks: /* value */, limit: /* value */, offset: /* value */, query: /* value */, sort: /* value */, useCache: /* value */ });
```

### library.getAll

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1983`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `asyncResult` | `boolean` | No | Optional; default false. |
| `count` | `integer` | No | Optional; default 100. |
| `limit` | `integer` | No | Optional; default 100. |
| `offset` | `integer` | No | Optional; default 0. |
| `start` | `integer` | No | Optional; default 0. |
| `useCache` | `boolean` | No | Optional; default true. |

**Returns**: `{"error":"...","fromCache":"...","items":[],"limit":"...","offset":"...","pending":"...","requestId":"...","total":"...","tracks":[]}`

```js
const result = await fb2k.invoke('library.getAll', { asyncResult: /* value */, count: /* value */, limit: /* value */, offset: /* value */, start: /* value */, useCache: /* value */ });
```

### library.getArtistAlbums

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1975`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `artist` | `string` | No | Optional; default . |
| `limit` | `integer` | No | Optional; default 100. |

**Returns**: `{"albums":"...","error":"...","success":true}`

```js
const result = await fb2k.invoke('library.getArtistAlbums', { artist: /* value */, limit: /* value */ });
```

### library.getArtistTracks

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1971`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `artist` | `string` | No | Optional; default . |
| `limit` | `integer` | No | Optional; default 500. |

**Returns**: `{"artist":"...","count":"...","items":"...","success":true,"total":"...","tracks":"..."}`

```js
const result = await fb2k.invoke('library.getArtistTracks', { artist: /* value */, limit: /* value */ });
```

### library.getArtists

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1968`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | `integer` | No | Optional; default 1000. |
| `sort` | `string` | No | Optional; default name. |

**Returns**: `{"count":"...","error":"...","items":"...","success":true}`

```js
const result = await fb2k.invoke('library.getArtists', { limit: /* value */, sort: /* value */ });
```

### library.getByPath

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1984`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | `string` | No | Optional; default . |

**Returns**: `{"absolutePath":"...","album":"...","artist":"...","date":"...","duration":"...","error":"...","found":"...","genre":"...","path":"...","success":true,"title":"...","trackNumber":"..."}`

```js
const result = await fb2k.invoke('library.getByPath', { path: /* value */ });
```

### library.getCacheStats

Public API method. Runtime authority: `src/api/LibraryApi.cpp:447-458` (merges `LibraryCache::GetStats` + `LibraryTreeIndex::GetStats`).

_No parameters._

**Returns**: cache/tree stats object with keys `valid`, `lastModified`, `albumsCacheEntries`, `tracksCached`, `artistsCached`, `genresCached`, `statsCached`, `coversCached`, `coverCacheBytes`, `coverCacheMB`, `cacheHits`, `cacheMisses`, `treeIndexValid`, `rootsCached`, `treeIndexedTracks`, `treeSkippedTracks`, `treeLastBuilt`.

```js
const result = await fb2k.invoke('library.getCacheStats');
```

### library.getCount

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1982`.

_No parameters._

**Returns**: `{"count":"...","success":true}`

```js
const result = await fb2k.invoke('library.getCount');
```

### library.getFieldValues

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1976`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `field` | `string` | No | Optional; default . |
| `limit` | `integer` | No | Optional; default 5000. |
| `separator` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","field":"...","success":true,"total":"...","values":"..."}`

```js
const result = await fb2k.invoke('library.getFieldValues', { field: /* value */, limit: /* value */, separator: /* value */ });
```

### library.getGenres

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1969`.

_No parameters._

**Returns**: `{"error":"...","genres":"...","success":true}`

```js
const result = await fb2k.invoke('library.getGenres');
```

### library.getRandomTracks

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1972`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `count` | `integer` | No | Optional; default 10. |

**Returns**: `{"count":"...","success":true,"tracks":"..."}`

```js
const result = await fb2k.invoke('library.getRandomTracks', { count: /* value */ });
```

### library.getRecentlyAdded

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1985`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | `integer` | No | Optional; default 50. |
| `sortBy` | `string` | No | Optional; default added. |

**Returns**: `{"fallback":"...","limit":"...","sortBy":"...","success":true,"total":"...","tracks":"..."}`

```js
const result = await fb2k.invoke('library.getRecentlyAdded', { limit: /* value */, sortBy: /* value */ });
```

### library.getRoots

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1978`.

_No parameters._

**Returns**: `{"fromCache":"..."}`

```js
const result = await fb2k.invoke('library.getRoots');
```

### library.getStats

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1963`.

_No parameters._

**Returns**: `{"cacheValid":"...","lastModified":"...","totalAlbums":"...","totalArtists":"...","totalDuration":"...","totalSize":"...","totalTracks":"..."}`

```js
const result = await fb2k.invoke('library.getStats');
```

### library.getStatus

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1981`.

_No parameters._

**Returns**: `{"count":0,"enabled":true,"initialized":"...","itemCount":"...","scanning":"..."}`

```js
const result = await fb2k.invoke('library.getStatus');
```

### library.invalidateCache

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1964`.

_No parameters._

**Returns**: `{"success":true,"timestamp":"..."}`

```js
const result = await fb2k.invoke('library.invalidateCache');
```

### library.isEnabled

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1962`.

_No parameters._

**Returns**: `{"enabled":"...","success":true}`

```js
const result = await fb2k.invoke('library.isEnabled');
```

### library.query

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1977`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | `integer` | No | Optional; default 100. |
| `query` | `string` | No | Optional; default . |
| `sort` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","success":true,"total":"...","tracks":"..."}`

```js
const result = await fb2k.invoke('library.query', { limit: /* value */, query: /* value */, sort: /* value */ });
```

### library.refresh

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1986`.

_No parameters._

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('library.refresh');
```

### library.rescan

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1973`.

_No parameters._

**Returns**: `{"success":true}`

```js
const result = await fb2k.invoke('library.rescan');
```

### library.search

Public API method. Runtime authority: `src/api/LibraryApi.cpp:1966`.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | `integer` | No | Optional; default 100. |
| `offset` | `integer` | No | Optional; default 0. |
| `query` | `string` | No | Optional; default . |

**Returns**: `{"error":"...","hasMore":"...","items":"...","limit":"...","offset":"...","success":true,"total":"...","tracks":"..."}`

```js
const result = await fb2k.invoke('library.search', { limit: /* value */, offset: /* value */, query: /* value */ });
```

## Contract notes

- `library.getAll` accepts either `start` or `offset`, and either `count` or `limit`; when both members of a pair are present, `start` and `count` take precedence. The defaults are `0`, `0`, `100`, and `100` respectively. `useCache` defaults to `true`.
- `asyncResult` defaults to `false`. When it is `true` for a full-library request, the immediate result is `{ pending, requestId }`; the completed `{ requestId, tracks, items, total, offset, limit, fromCache }` payload is delivered to the calling WebView through `library:getAllResult`.
- `library.getRoots` and `library.browseTree` are the typed library-navigation APIs. `library.browseDirectory` is the legacy path-prefix projection and does not represent the real root set.
- `library.getAlbums` adds `coverDataUrl` only when `includeCover` is enabled and artwork is available. It is a `data:image/...` URL, not an `fb2k://` URL.
- `library.search` and `library.query` use foobar2000 query syntax. The implementation relies on `search_filter_v2`; clients should treat invalid expressions as a handler error rather than attempting to parse the syntax locally.
- `library.getStatus` and `library.getCount` enumerate through `enum_items` rather than returning a `metadb_handle_list`. The `library_callback_v2` callback invalidates the cache before it broadcasts the events below.

## Library events

All four events are broadcast to every WebView. Their authority is `src/callbacks/LibraryCallback.cpp`.

| Event | Payload |
| --- | --- |
| `library:itemsAdded` | `{ count, timestamp }` |
| `library:itemsRemoved` | `{ count, timestamp }` |
| `library:itemsModified` | `{ count, timestamp }` |
| `library:initialized` | `{ timestamp }` |
