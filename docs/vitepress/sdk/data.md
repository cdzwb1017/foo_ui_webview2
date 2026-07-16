# Data and Metadata

This page covers the `fb.metadata`, `fb.titleformat`, `fb.playcount`, `fb.selection`, and `fb.rating` namespaces.

## fb.metadata Tag Reading and Writing

### read(path)

Reads structured metadata and returns `{ success, path, tags, info }`. Tag keys preserve upstream casing, typically uppercase, and multi-value fields may be `string[]`.

```javascript
const meta = await fb.metadata.read('C:\\Music\\song.flac');
console.log(meta.tags, meta.info.sampleRate);
```

### readBatch(paths)

Reads multiple files and returns an envelope with one entry per requested path in `results`, plus aggregate counts when available.

```javascript
const results = await fb.metadata.readBatch([
    'C:\\Music\\song1.flac',
    'C:\\Music\\song2.flac'
]);
```

### readByPath(path)

Reads a loose, flat metadata object in which tags become top-level fields alongside values such as `success`, `path`, and `canonicalPath`. Keys preserve the upstream casing and are typically uppercase.

```javascript
const meta = await fb.metadata.readByPath('C:\\Music\\song.flac');
console.log(meta.TITLE, meta.DURATION, meta.SAMPLERATE);
```

### readRaw(path, options?)

Bypasses the metadb cache and reads metadata directly from the file. `options.cueIndex` may select a CUE subsong. The structured response has `source: 'file'`.

```javascript
const raw = await fb.metadata.readRaw('C:\\Music\\song.flac');
```

### write(path, tags)

Dispatches an asynchronous tag write. The immediate response is a dispatch receipt; final completion arrives through `metadata:writeComplete`.

| Parameter | Type | Description |
| --- | --- | --- |
| `path` | `string` | File path |
| `tags` | `JsonObject` | Tag field/value map |

```javascript
await fb.metadata.write('C:\\Music\\song.flac', {
    artist: 'New Artist',
    title: 'New Title'
});
```

### writeBatch(items)

Dispatches metadata writes for multiple files.

| Parameter | Type | Description |
| --- | --- | --- |
| `items` | `Array<{ path: string; tags: JsonObject }>` | Per-file writes |

```javascript
await fb.metadata.writeBatch([
    { path: 'C:\\Music\\song1.flac', tags: { artist: 'A' } },
    { path: 'C:\\Music\\song2.flac', tags: { artist: 'B' } }
]);
```

### embedArtwork(path, options?)

Writes artwork to the audio file, to a sibling image file, or to both targets. Omit `target` for the default embedded destination. The generated SDK type models explicit destinations as a `string[]`; use `['file']` for a sidecar or `['embedded', 'file']` for both. File mode derives a conventional sidecar name unless `filename` is supplied.

```javascript
await fb.metadata.embedArtwork('C:\\Music\\song.flac', {
    imageData: base64Data,
    type: 'front',
    target: ['embedded']
});
```

### removeEmbeddedArt(path, options?)

Removes embedded artwork. Options include `type` and `removeAll`.

```javascript
await fb.metadata.removeEmbeddedArt('C:\\Music\\song.flac');
```

### removeField(path, field)

Removes one tag field. The facade sends the host a one-element `tags` array.

```javascript
await fb.metadata.removeField('C:\\Music\\song.flac', 'COMMENT');
```

### removeTag(path, tags)

Removes multiple tag fields.

```javascript
await fb.metadata.removeTag('C:\\Music\\song.flac', ['COMMENT', 'LYRICS']);
```

### disableDefaultLogger()

Detaches the SDK's default `metadata:writeComplete` failure logger. The operation is idempotent.

### metadata:writeComplete

The completion event carries `{ operation, path, subsong, code, success, status }`, where `status` is `success`, `aborted`, or `error`.

## fb.titleformat Title Formatting

### eval(pattern, path?)

Evaluates a title-format expression. Without `path`, it evaluates against the current track.

| Parameter | Type | Description |
| --- | --- | --- |
| `pattern` | `string` | Title-format expression |
| `path` | `string` | Optional track path |

```javascript
const r = await fb.titleformat.eval('%artist% - %title%');
console.log(r.result); // 'Artist - Title'
```

### evalBatch(pattern, paths)

Evaluates one expression against multiple paths.

```javascript
const results = await fb.titleformat.evalBatch(
    '%artist% - %title%',
    ['C:\\Music\\song1.flac', 'C:\\Music\\song2.flac']
);
```

### evalFields(path, fields)

Evaluates a map of output names to title-format expressions for one track.

```javascript
const result = await fb.titleformat.evalFields('C:\\Music\\song.flac', {
    artist: '%artist%',
    title: '%title%',
    album: '%album%'
});
// result.values.artist, result.values.title, result.values.album
```

### evalFieldsBatch(paths, fields)

Evaluates the same named expression map for multiple paths. The host compiles the merged pattern once for the batch.

### getBuiltinFields()

Returns the built-in title-format fields.

```javascript
const r = await fb.titleformat.getBuiltinFields();
// r.fields: ['artist', 'title', 'album', ...]
```

## fb.playcount Playback Statistics

### get(path)

Returns one `PlaycountInfo` entry, or `null` when the host returns an empty or failed envelope. The value is exposed as `playCount`, not `count`.

```javascript
const r = await fb.playcount.get('C:\\Music\\song.flac');
console.log(r?.playCount);
```

### getBatch(paths)

Returns the full `{ success, count, results }` envelope for multiple paths. Per-track results may also include `firstPlayed`, `lastPlayed`, `added`, `rating`, and `inLibrary`.

```javascript
const results = await fb.playcount.getBatch([
    'C:\\Music\\song1.flac',
    'C:\\Music\\song2.flac'
]);
```

### set(path, count) <Badge type="warning" text="Deprecated" />

The host does not expose a public API for mutating playback statistics. This compatibility method always returns `success: false`; use `fb.rating.set()` for ratings or actual playback to advance play counts.

```javascript
const result = await fb.playcount.set('C:\\Music\\song.flac', 42);
// result.success === false
```

### getStats()

Returns library-wide totals, including played, unplayed, and rated track counts, total and maximum play counts, and average play count and rating.

```javascript
const stats = await fb.playcount.getStats();
```

## fb.selection Selection Synchronization

### get(options?)

Returns the current metadb-handle selection. Options support pagination only.

| Field | Type | Description |
| --- | --- | --- |
| `options.offset` | `number` | Starting offset; defaults to `0` |
| `options.limit` | `number` | Maximum item count; defaults to `100` |

```javascript
const sel = await fb.selection.get({ offset: 0, limit: 50 });
// sel.handles, sel.count, sel.type, sel.hasMore
```

### getType()

Returns `{ type }` for the current selection source.

```javascript
const r = await fb.selection.getType();
```

### set(handles)

Sets the current selection from the supplied handle list.

```javascript
await fb.selection.set([handle1, handle2]);
```

### setPlaylistTracking(mode?)

Sets the tracking source. The mode is `selection` by default or `playlist`.

| Parameter | Type | Description |
| --- | --- | --- |
| `mode` | `'selection' \| 'playlist'` | Tracking source |

```javascript
await fb.selection.setPlaylistTracking('playlist');
```

### getViewerMode()

Returns `{ mode }` for the current viewing-track resolver.

### getViewingTrack(options?)

Resolves the currently viewed track. Set `includeTrackInfo` to include the typed `track` object. The response includes `found`, `mode`, and, when found, the source and resolved handle details.

```javascript
const track = await fb.selection.getViewingTrack({ includeTrackInfo: true });
```

## fb.rating Ratings

### get(path)

Returns the integer rating from 0 to 5 for a track. Paths may include a `|subsong:N` suffix.

```javascript
const r = await fb.rating.get('C:\\Music\\song.flac');
console.log(r.rating); // 0-5
```

### set(path, rating, options?)

Sets an integer rating from 0 to 5. Zero clears the rating. `options.cueIndex` explicitly selects a CUE subsong and takes precedence over a `|subsong:N` path suffix.

| Parameter | Type | Description |
| --- | --- | --- |
| `path` | `string` | Absolute track path |
| `rating` | `number` | Integer in `[0, 5]`; `0` clears the rating |
| `options.cueIndex` | `number` | Optional explicit CUE subsong index |

```javascript
await fb.rating.set('C:\\Music\\song.flac', 5);
await fb.rating.set('C:\\Music\\song.flac', 0); // Clear the rating
```
