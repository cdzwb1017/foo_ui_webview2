# Files, Networking, and Native I/O

This page summarizes the `fb.file`, `fb.http`, `fb.dialog`, and `fb.clipboard` namespaces. See each namespace page for the complete typed contract.

## fb.file File System

### read(path, options?)

Reads a text file and resolves with `{ content }`.

| Parameter | Type | Description |
| --- | --- | --- |
| `path` | `string` | File path |
| `options.encoding` | `string` | Optional encoding; defaults to `utf-8` |

```javascript
const { content } = await fb.file.read('C:\\Config\\settings.json');
```

### write(path, content, options?)

Writes text and returns a response that may include `bytesWritten`.

| Parameter | Type | Description |
| --- | --- | --- |
| `path` | `string` | File path |
| `content` | `string` | Text content |
| `options.encoding` | `string` | Optional encoding; defaults to `utf-8` |
| `options.append` | `boolean` | Append instead of replacing; defaults to `false` |

```javascript
await fb.file.write('C:\\Logs\\theme.log', 'Ready\n', { append: true });
```

### exists(path)

Checks whether a file-system entry exists and returns `{ exists }`.

```javascript
const r = await fb.file.exists('C:\\Music\\song.flac');
if (r.exists) { /* ... */ }
```

### list(path, options?)

Lists files and directories.

| Parameter | Type | Description |
| --- | --- | --- |
| `path` | `string` | Directory path |
| `options.pattern` | `string` | File-mask pattern; defaults to `*` |
| `options.recursive` | `boolean` | Recursively enumerate entries; defaults to `false` |

```javascript
const r = await fb.file.list('C:\\Music', { pattern: '*.flac', recursive: true });
// r.files, r.directories, r.items
```

### delete(path)

Deletes an entry. The facade uses the host default of moving it to the Recycle Bin.

```javascript
await fb.file.delete('C:\\Temp\\cache.dat');
```

### mkdir(path)

Creates a directory and any missing parents.

```javascript
await fb.file.mkdir('C:\\Output\\Logs');
```

### copy(source, destination)

Copies a file. The facade does not request overwrite behavior.

```javascript
await fb.file.copy('C:\\Source\\track.flac', 'C:\\Backup\\track.flac');
```

### move(source, destination)

Moves a file-system entry.

```javascript
await fb.file.move('C:\\Old\\file.txt', 'C:\\New\\file.txt');
```

### rename(path, newName)

Renames an entry within its current parent directory.

| Parameter | Type | Description |
| --- | --- | --- |
| `path` | `string` | Current path |
| `newName` | `string` | New name only, not a destination path |

```javascript
await fb.file.rename('C:\\Music\\old.mp3', 'new.mp3');
```

### getInfo(path)

Returns file-system metadata. Available fields include `exists`, `isDirectory`, `isFile`, `size`, `modified`, `name`, `extension`, and `parent`; `modified` is a JavaScript timestamp in milliseconds.

```javascript
const info = await fb.file.getInfo('C:\\Music\\song.flac');
// info.size, info.modified, ...
```

## fb.http HTTP Client

### get(url, options?)

Dispatches a GET request through the host. Requests are asynchronous by default: the immediate result contains `requestId`, and the final response arrives through `http:response`. Use `{ async: false }` for a direct response or `request()` for an awaited event-driven GET.

```javascript
const r = await fb.http.get('https://api.example.com/data', { async: false });
// r.status, r.body, r.headers
```

### post(url, body?, options?)

Dispatches a POST request. Non-string JSON bodies are serialized by the host.

| Parameter | Type | Description |
| --- | --- | --- |
| `url` | `string` | Request URL |
| `body` | `JsonValue` | Optional request body |
| `options` | `HttpRequestOptions` | Headers, timeout, async mode, redirects, response decoding, and TLS policy |

```javascript
await fb.http.post('https://api.example.com/submit', { title: 'test' });
```

### head(url, options?)

Dispatches a HEAD request. A synchronous response may include `contentLength` parsed from the response headers.

```javascript
const r = await fb.http.head('https://example.com/file.zip');
// Final async result: http:response; direct result when async: false
```

### download(url, saveTo, options?)

Downloads a URL to a local path. Download mode is synchronous by default; `{ async: true }` reports final completion through `http:downloadComplete`.

| Parameter | Type | Description |
| --- | --- | --- |
| `url` | `string` | Download URL |
| `saveTo` | `string` | Destination path |
| `options` | `HttpDownloadOptions` | Optional headers, timeout, redirects, async mode, request ID, and TLS policy |

```javascript
await fb.http.download('https://example.com/cover.jpg', 'C:\\Covers\\cover.jpg');
```

### put(url, body?, options?)

Dispatches a PUT request with the same body and option semantics as `post()`.

### delete(url, body?, options?)

Dispatches a DELETE request. The optional body is the second positional argument.

### patch(url, body?, options?)

Dispatches a PATCH request with the same body and option semantics as `post()`.

### request(url, options?)

Performs a GET and waits for either a synchronous host reply or the matching `http:response` event. The SDK cleans up its event listener and timeout on every completion path.

### abort(requestId)

Cancels an in-flight request using the correlation ID returned by an asynchronous dispatch.

## fb.dialog Native Dialogs

### openFile(options?)

Opens the native file picker and returns `{ canceled, filePaths, error? }`.

```javascript
const r = await fb.dialog.openFile({
	multiple: true,
	filters: ['*.flac', '*.mp3']
});
// r.filePaths
```

### saveFile(options?)

Opens the native save picker and returns `{ canceled, filePath, error? }`.

```javascript
const r = await fb.dialog.saveFile({ defaultName: 'playlist.m3u8' });
// r.filePath
```

### openFolder(options?)

Opens the native folder picker and returns `{ canceled, folderPath, error? }`.

```javascript
const r = await fb.dialog.openFolder({ title: 'Choose a music folder' });
// r.folderPath
```

### confirm(options?)

Displays a native confirmation dialog and returns `{ confirmed }`.

```javascript
const r = await fb.dialog.confirm({ title: 'Confirm', message: 'Delete this item?' });
if (r.confirmed) { /* confirmed */ }
```

## fb.clipboard Clipboard

### read()

Reads clipboard text.

```javascript
const r = await fb.clipboard.read();
console.log(r.text);
```

### write(text)

Writes plain text.

```javascript
await fb.clipboard.write('Copied text');
```

### writeHTML(html, plainText?)

Writes HTML and an optional non-empty plain-text fallback.

```javascript
await fb.clipboard.writeHTML('<strong>Now playing</strong>', 'Now playing');
```

### writeFiles(paths)

Writes a file-list payload for pasting into file-aware applications.

```javascript
await fb.clipboard.writeFiles(['C:\\Music\\a.flac', 'C:\\Music\\b.flac']);
```
