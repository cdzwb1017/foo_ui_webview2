# fb.cursor 光标控制

`fb.cursor` 用于显式控制调用窗口客户区内的光标。状态与 `cursor:hiddenChanged` 事件都限定在发起调用的窗口，因此各弹窗可以独立管理光标可见性。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### isHidden()

签名：`fb.cursor.isHidden(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `cursor.isHidden` 调用结果。

```javascript
const result = await fb.cursor.isHidden();
```

### setHidden()

签名：`fb.cursor.setHidden(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `cursor.setHidden` 调用结果。

```javascript
const result = await fb.cursor.setHidden();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## 事件

`cursor:hiddenChanged` 携带 `{ hidden: boolean }`，且只会发送给改变了光标状态的窗口。
