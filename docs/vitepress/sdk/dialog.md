# fb.dialog Native Dialogs

`fb.dialog` opens host-native file, folder, save, and confirmation dialogs.

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK Methods

> This block provides SDK-level method coverage and may later be expanded with complete examples and best practices.

### confirm(options?)

Signature: `fb.dialog.confirm(options?: DialogConfirmParams): Promise<{ confirmed: boolean }>`

| Field | Type | Description |
| --- | --- | --- |
| `title` | `string` | Dialog title; defaults to `Confirm` |
| `message` | `string` | Confirmation message |
| `type` | `string` | Dialog type; defaults to `question` |
| `defaultButton` | `number` | Default button index |
| `buttons` | `string[]` | Custom button labels |

```javascript
const { confirmed } = await fb.dialog.confirm({
	title: 'Remove track',
	message: 'Remove the selected track?'
});
```

### openFile(options?)

Signature: `fb.dialog.openFile(options?: DialogOpenFileParams): Promise<DialogOpenFileResponse>`

Returns `{ canceled, filePaths, error? }`. Set `multiple` to allow multiple selections; other options include `title`, `defaultPath`, `filters`, `name`, and `extensions`.

```javascript
const result = await fb.dialog.openFile({
	title: 'Choose audio files',
	multiple: true,
	filters: ['*.flac', '*.mp3']
});
```

### openFolder(options?)

Signature: `fb.dialog.openFolder(options?: DialogOpenFolderParams): Promise<DialogOpenFolderResponse>`

Accepts an optional `title` and returns `{ canceled, folderPath, error? }`.

```javascript
const result = await fb.dialog.openFolder({ title: 'Choose a music folder' });
```

### saveFile(options?)

Signature: `fb.dialog.saveFile(options?: DialogSaveFileParams): Promise<DialogSaveFileResponse>`

Returns `{ canceled, filePath, error? }`. Options include `title`, `defaultName`, `filters`, `name`, and `extensions`.

```javascript
const result = await fb.dialog.saveFile({ defaultName: 'playlist.m3u8' });
```

<!-- END AUTO-GENERATED SDK STUBS -->
