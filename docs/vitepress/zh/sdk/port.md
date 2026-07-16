# fb.port 跨窗口端口

`fb.port` 提供具名的跨窗口消息通道。先调用 `connect(name)` 取得 `portId`，之后使用该 ID 发送消息或断开连接。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### disconnect()

签名：`fb.port.disconnect(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `port.disconnect` 调用结果。接收端可通过 `onDisconnect(handler)` 订阅 `port:disconnected`。

```javascript
const result = await fb.port.disconnect();
```

### getPorts()

签名：`fb.port.getPorts(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `port.getPorts` 调用结果。

```javascript
const result = await fb.port.getPorts();
```

### postMessage()

签名：`fb.port.postMessage(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `port.postMessage`、`port.postMessageTo` 调用结果。`postMessageTo(portId, targetPortId, message)` 可定向发送到一个已连接端口；`onMessage(handler)` 接收 `port:message`，`onConnect(handler)` 与 `onDisconnect(handler)` 订阅生命周期事件。每个订阅方法都返回取消订阅函数。

```javascript
const { portId } = await fb.port.connect('transport');
const result = await fb.port.postMessage(portId, { action: 'play' });
await fb.port.postMessageTo(portId, targetPortId, { action: 'pause' });

const offMessage = fb.port.onMessage((data) => console.log(data));
const offConnect = fb.port.onConnect((data) => console.log(data));
const offDisconnect = fb.port.onDisconnect((data) => console.log(data));

offMessage();
offConnect();
offDisconnect();
```

<!-- END AUTO-GENERATED SDK STUBS -->
