# fb.file File System

`fb.file` exposes host-side file and directory operations to the WebView.

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK Methods

> This block provides SDK-level method coverage and may later be expanded with complete examples and best practices.

### read(path, options?)

Signature: `fb.file.read(path: string, options?: Omit<FileReadParams, 'path'>): Promise<{ content: string }>`

Reads a text file. `options.encoding` defaults to `utf-8`.

```javascript
const { content } = await fb.file.read('C:\\Config\\settings.json');
```

### write(path, content, options?)

Signature: `fb.file.write(path: string, content: string, options?: Omit<FileWriteParams, 'path' | 'content'>): Promise<BaseResponse & { bytesWritten?: number }>`

Writes text to a file. `options.encoding` defaults to `utf-8`; set `options.append` to append instead of replacing the file.

```javascript
await fb.file.write('C:\\Logs\\theme.log', 'Theme initialized\n', { append: true });
```

### exists(path)

Signature: `fb.file.exists(path: string): Promise<{ exists: boolean }>`

Tests whether a file-system entry exists.

### list(path, options?)

Signature: `fb.file.list(path: string, options?: Omit<FileListParams, 'path'>): Promise<FileListResponse>`

Lists matching files and directories. `options.pattern` defaults to `*`; `options.recursive` defaults to `false`. The response exposes `files`, `directories`, and the compatibility alias `items`.

```javascript
const result = await fb.file.list('C:\\Music', {
	pattern: '*.flac',
	recursive: true
});
```

### delete(path)

Signature: `fb.file.delete(path: string): Promise<BaseResponse>`

Deletes the file-system entry. The SDK facade passes only `path`, so the host's default `moveToTrash: true` behavior applies.

### mkdir(path)

Signature: `fb.file.mkdir(path: string): Promise<BaseResponse & { created?: boolean }>`

Creates a directory, including missing parent directories.

### copy(source, destination)

Signature: `fb.file.copy(source: string, destination: string): Promise<BaseResponse>`

Copies a file. The SDK facade does not expose the host's optional `overwrite` field, so existing destinations are not overwritten by default.

```javascript
await fb.file.copy('C:\\Music\\track.flac', 'C:\\Backup\\track.flac');
```

### move(source, destination)

Signature: `fb.file.move(source: string, destination: string): Promise<BaseResponse>`

Moves a file-system entry to a new path.

### rename(path, newName)

Signature: `fb.file.rename(path: string, newName: string): Promise<BaseResponse & { oldPath?: string; newPath?: string }>`

Renames an entry within its current parent directory. `newName` is a name, not a destination path.

```javascript
await fb.file.rename('C:\\Music\\old.flac', 'new.flac');
```

### getInfo(path)

Signature: `fb.file.getInfo(path: string): Promise<FileGetInfoResponse>`

Returns `exists` and, when available, `isDirectory`, `isFile`, `size`, `modified`, `name`, `extension`, and `parent`. `modified` is a JavaScript timestamp in milliseconds.

```javascript
const info = await fb.file.getInfo('C:\\Music\\track.flac');
console.log(info.size, info.modified);
```

<!-- END AUTO-GENERATED SDK STUBS -->
