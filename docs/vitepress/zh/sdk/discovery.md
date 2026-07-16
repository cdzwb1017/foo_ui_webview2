# fb.discovery 服务发现

本页是 `fb.discovery` 的 SDK 视角文档入口。

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK 方法 stub

> 该区块用于补齐 SDK 视角方法覆盖，后续可人工扩展为完整示例与最佳实践。

### getAllServices()

签名：`fb.discovery.getAllServices(): Promise<DiscoveryGetAllServicesResponse>`

返回 `services` 中各服务类别的数量，以及汇总后的 `totalServices`。

### getMainMenuCommands()

签名：`fb.discovery.getMainMenuCommands(): Promise<DiscoveryGetMainMenuCommandsResponse>`

返回 `{ commands, count }`。每个命令包含 `name`、`description`、`guid`、`parentGuid` 与 `index`。

### executeMainMenuCommand(guid)

签名：`fb.discovery.executeMainMenuCommand(guid: string): Promise<BaseResponse>`

按 GUID 执行主菜单命令。

### executeContextMenuCommand(options)

签名：`fb.discovery.executeContextMenuCommand(options: DiscoveryExecuteContextMenuCommandParams): Promise<BaseResponse & { itemCount?: number }>`

按 `options.guid` 执行上下文菜单命令。

### executeContextMenuByPath(options)

签名：`fb.discovery.executeContextMenuByPath(options: DiscoveryExecuteContextMenuByPathParams): Promise<BaseResponse & { foundName?: string; itemCount?: number }>`

按菜单 `path` 执行上下文菜单项，也可通过 `trackPath` 指定曲目。

### getInputFormats()

签名：`fb.discovery.getInputFormats(): Promise<DiscoveryGetInputFormatsResponse>`

返回 `{ fileTypes, count }`；每种文件类型包含 `name`、文件掩码 `mask` 与 `index`。

### getComponents()

签名：`fb.discovery.getComponents(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getComponents` 调用结果。

```javascript
const result = await fb.discovery.getComponents();
```

### getContextMenuCommands()

签名：`fb.discovery.getContextMenuCommands(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getContextMenuCommands` 调用结果。

```javascript
const result = await fb.discovery.getContextMenuCommands();
```

### getContextMenuTree()

签名：`fb.discovery.getContextMenuTree(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getContextMenuTree` 调用结果。

```javascript
const result = await fb.discovery.getContextMenuTree();
```

### getDspEntries()

签名：`fb.discovery.getDspEntries(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getDspEntries` 调用结果。

```javascript
const result = await fb.discovery.getDspEntries();
```

### getMainMenuGroups()

签名：`fb.discovery.getMainMenuGroups(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getMainMenuGroups` 调用结果。

```javascript
const result = await fb.discovery.getMainMenuGroups();
```

### getOutputDevices()

签名：`fb.discovery.getOutputDevices(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getOutputDevices` 调用结果。

```javascript
const result = await fb.discovery.getOutputDevices();
```

### getPreferencePages()

签名：`fb.discovery.getPreferencePages(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getPreferencePages` 调用结果。

```javascript
const result = await fb.discovery.getPreferencePages();
```

### getUIElements()

签名：`fb.discovery.getUIElements(...args): Promise<unknown>`

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ...args | unknown[] | 视方法而定 | 透传给 SDK wrapper；详细类型以 `sdk/src/bridge/namespaces/` 源码和生成类型为准 |

返回值：底层 `discovery.getUIElements` 调用结果。

```javascript
const result = await fb.discovery.getUIElements();
```

### searchCommands(query)

签名：`fb.discovery.searchCommands(query: string): Promise<DiscoverySearchCommandsResponse>`

搜索主菜单命令，返回原始 `query`、`results` 与 `count`；当前结果的 `type` 分类值为 `mainmenu`。

```javascript
const result = await fb.discovery.searchCommands('preferences');
```

<!-- END AUTO-GENERATED SDK STUBS -->
