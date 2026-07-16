# fb.rating rating

本页是 `fb.rating` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### get()

签名：`fb.rating.get(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值为 `{ rating }`。使用 `set(path, rating, { cueIndex? })` 写入评分；`rating` 必须是 0 到 5 的整数，其中 0 表示清除评分。显式 `cueIndex` 的优先级高于路径中的 `\|subsong:N` 后缀。写入响应可能说明使用的 `menuPath`、存储后端或回退提示。

```javascript
const result = await fb.rating.get('E:\\Music\\song.flac');
await fb.rating.set('E:\\Music\\song.flac', 4);
```

<!-- END AUTO-GENERATED SDK STUBS -->
