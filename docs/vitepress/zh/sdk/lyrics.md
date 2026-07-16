# fb.lyrics lyrics

本页是 `fb.lyrics` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### exists()

签名：`fb.lyrics.exists(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `lyrics.exists` 调用结果。

```javascript
const result = await fb.lyrics.exists();
```

### get()

签名：`fb.lyrics.get(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `lyrics.get` 调用结果。

```javascript
const result = await fb.lyrics.get();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## 保存歌词

`fb.lyrics.save(path, lyricsText, options?)` 调用 `lyrics.save`。`options` 的类型为 `Omit<LyricsSaveParams, 'path' | 'lyrics'>`，可包含 `filename`、`tagName`、`format` 与 `target`。

SDK 返回类型为 `BaseResponse & { results?: Array<{ target: string; success: boolean; error?: string }>; savedTo?: string[] }`。

```javascript
const result = await fb.lyrics.save(
	'E:\\Music\\song.flac',
	'[00:00.00]歌词……',
	{
		target: ['file', 'embedded'],
		format: 'lrc',
		tagName: 'SYNCEDLYRICS',
	},
);
```
