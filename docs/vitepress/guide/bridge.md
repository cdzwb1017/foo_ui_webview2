# Bridge Protocol

The component talks to the C++ host through WebView2 `window.chrome.webview.postMessage`, wrapped as the `window.fb2k` object.

## Bridge object

The component injects `window.fb2k`:

```javascript
window.fb2k = {
    // Call an API
    invoke(method, params) → Promise<result>,
    
    // Subscribe to events
    on(event, callback) → unsubscribe function,
    
    // Internal fields (do not use directly)
    _callbacks: Map,
    _callId: number,
    _evts: Object
};
```

## Request format

```json
{
    "id": 1,
    "method": "playback.play",
    "params": {}
}
```

| Field | Type | Description |
| --- | --- | --- |
| id | number | Auto-increment request id used to match responses |
| method | string | API method name as `namespace.action` |
| params | object | Request parameters |

## Response format

### Success

```json
{
    "type": "response",
    "id": 1,
    "result": { "success": true }
}
```

### Error

```json
{
    "type": "response",
    "id": 1,
    "error": "Invalid playlist index"
}
```

## Event format

```json
{
    "type": "event",
    "event": "playback:trackChanged",
    "data": {
        "title": "Song Name",
        "artist": "Artist Name",
        "album": "Album Name",
        "duration": 180.5
    }
}
```

## Important notes

### Async calls

Every `fb2k.invoke()` returns a Promise — **always `await` or use `.then()`**:

```javascript
// ✅ Correct
await fb2k.invoke('playback.play');
const track = await fb2k.invoke('playback.getCurrentTrack');

// ❌ Wrong: missing await leaves the call unfinished
fb2k.invoke('playback.play');
const track = fb2k.invoke('playback.getCurrentTrack'); // Promise, not result
```

### Event name format

Events use **colon-separated** names:

```javascript
// ✅ Correct
fb2k.on('playback:trackChanged', callback);
fb2k.on('playback:stateChanged', callback);
fb2k.on('playlist:itemsAdded', callback);

// ❌ Unsupported
fb2k.on('playback.trackChanged', callback);
fb2k.on('playbackTrackChanged', callback);
```

### Volume format

| Context | Range | Notes |
| --- | --- | --- |
| API input/output | 0-100 | Integer percent; 0=mute, 100=max |
| Slider controls | 0-100 | Bind directly |
| dB conversion | - | 0% ≈ -100dB, 100% = 0dB |

### Path format

Track objects returned by the API include two path fields:

| Field | Description |
| --- | --- |
| path | foobar2000 internal path (may be `file-relative://`, etc.) |
| absolutePath | Local filesystem absolute path (preferred) |

::: warning Always prefer absolutePath
When calling path-based APIs such as `artwork.getForTrack`, pass `absolutePath`, not `path`.
:::

#### Path kinds

| Prefix | Kind | Example |
| --- | --- | --- |
| C:\\ D:\\ | Local file | D:\\Music\\song.flac |
| file:// | URI form | file://D:/Music/song.flac |
| file-relative:// | Relative path | file-relative://../../song.flac |
| archive:// | Archive entry | archive://D:\\Album.zip\|track01.flac |
| cdda:// | CD track | cdda://E,1 |
| http:// https:// | Network stream | https://stream.example.com/live |

#### File type detection

```javascript
function getFileType(absolutePath) {
    if (!absolutePath) return 'unknown';
    if (absolutePath.startsWith('http://') || 
        absolutePath.startsWith('https://')) return 'stream';
    if (absolutePath.startsWith('cdda://')) return 'cd';
    if (absolutePath.startsWith('archive://') ||
        absolutePath.startsWith('unpack://')) return 'archive';
    return 'local';
}
```
