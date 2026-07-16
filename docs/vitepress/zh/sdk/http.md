# fb.http HTTP 请求

本页是 `fb.http` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### get(url, options?)

签名：`fb.http.get(url: string, options?: HttpRequestOptions): Promise<HttpResponse | HttpBinaryResponse>`

派发 GET 请求。主机默认异步执行请求，因此当前响应通常是 `{ success, requestId, async: true }`，最终响应通过 `http:response` 发出。传入 `{ async: false }` 可直接取得完整响应，也可以使用 `request()` 等待事件驱动结果。

```javascript
const response = await fb.http.get('https://api.example.com/data', { async: false });
```

### post(url, body?, options?)

签名：`fb.http.post(url: string, body?: JsonValue, options?: HttpRequestOptions): Promise<HttpResponse | HttpBinaryResponse>`

派发 POST 请求；主机会序列化非字符串 JSON 请求体。

### head(url, options?)

签名：`fb.http.head(url: string, options?: HttpRequestOptions): Promise<HttpResponse>`

派发 HEAD 请求。同步响应可能包含解析后的便利字段 `contentLength`。

### download(url, saveTo, options?)

签名：`fb.http.download(url: string, saveTo: string, options?: HttpDownloadOptions): Promise<BaseResponse & { requestId?: string; path?: string; bytesWritten?: number; cancelled?: boolean }>`

将 URL 下载到本地路径。默认以 60 秒主机超时同步执行；传入 `{ async: true }` 时，完成结果通过 `http:downloadComplete` 发出，并用 `requestId` 关联。

```javascript
const receipt = await fb.http.download(
	'https://example.com/cover.jpg',
	'C:\\Covers\\cover.jpg',
	{ async: true }
);
```

### abort()

签名：`fb.http.abort(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `http.abort` 调用结果。

```javascript
const result = await fb.http.abort();
```

### delete()

签名：`fb.http.delete(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `http.delete` 调用结果。

```javascript
const result = await fb.http.delete();
```

### patch()

签名：`fb.http.patch(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `http.patch` 调用结果。

```javascript
const result = await fb.http.patch();
```

### put()

签名：`fb.http.put(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `http.put` 调用结果。

```javascript
const result = await fb.http.put();
```

### request()

签名：`fb.http.request(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `http.get` 调用结果。

```javascript
const result = await fb.http.request();
```

### disableDefaultDownloadLogger()

签名：`fb.http.disableDefaultDownloadLogger(): void`

移除模块级默认日志器；该日志器会通过 `console.warn` 报告未取消的 `http:downloadComplete` 失败。此操作可重复调用。

## 事件

- `http:response` 携带 `{ requestId, success, status, body, headers, error?, responseType? }`。
- `http:downloadComplete` 携带 `{ requestId, success, status?, bytesWritten?, path?, error?, cancelled? }`。

<!-- END AUTO-GENERATED SDK STUBS -->
