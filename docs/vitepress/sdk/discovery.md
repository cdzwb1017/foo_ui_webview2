# fb.discovery Service Discovery

`fb.discovery` enumerates foobar2000 services, menus, installed components, input formats, UI elements, DSP entries, output devices, and preference pages.

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK Methods

> This block provides SDK-level method coverage and may later be expanded with complete examples and best practices.

### getAllServices()

Signature: `fb.discovery.getAllServices(): Promise<DiscoveryGetAllServicesResponse>`

Returns category counts in `services` and their sum in `totalServices`.

### getMainMenuCommands()

Signature: `fb.discovery.getMainMenuCommands(): Promise<DiscoveryGetMainMenuCommandsResponse>`

Returns `{ commands, count }`. Each command includes `name`, `description`, `guid`, `parentGuid`, and `index`.

### getMainMenuGroups()

Signature: `fb.discovery.getMainMenuGroups(): Promise<DiscoveryGetMainMenuGroupsResponse>`

Returns `{ groups, count }`. Group descriptors include `guid`, `parentGuid`, `name`, and `sortPriority`.

### executeMainMenuCommand(guid)

Signature: `fb.discovery.executeMainMenuCommand(guid: string): Promise<BaseResponse>`

Executes a main-menu command by GUID.

### getContextMenuCommands()

Signature: `fb.discovery.getContextMenuCommands(): Promise<DiscoveryGetContextMenuCommandsResponse>`

Returns a flat list of discoverable context-menu commands.

### executeContextMenuCommand(options)

Signature: `fb.discovery.executeContextMenuCommand(options: DiscoveryExecuteContextMenuCommandParams): Promise<BaseResponse & { itemCount?: number }>`

Executes a context-menu command by `options.guid`.

### executeContextMenuByPath(options)

Signature: `fb.discovery.executeContextMenuByPath(options: DiscoveryExecuteContextMenuByPathParams): Promise<BaseResponse & { foundName?: string; itemCount?: number }>`

Executes a context-menu item by menu `path`, optionally for `trackPath`.

### getContextMenuTree()

Signature: `fb.discovery.getContextMenuTree(): Promise<DiscoveryGetContextMenuTreeResponse>`

Returns a recursive `tree` of `command`, `popup`, `separator`, or `unknown` nodes, plus an optional `itemCount`.

### getInputFormats()

Signature: `fb.discovery.getInputFormats(): Promise<DiscoveryGetInputFormatsResponse>`

Returns `{ fileTypes, count }`; each file type includes `name`, file-mask `mask`, and `index`.

### getComponents()

Signature: `fb.discovery.getComponents(): Promise<DiscoveryGetComponentsResponse>`

Returns `{ components, count }`. Components include `filename`, `name`, `version`, and `about`.

```javascript
const { components } = await fb.discovery.getComponents();
```

### getDspEntries()

Signature: `fb.discovery.getDspEntries(): Promise<DiscoveryGetDspEntriesResponse>`

Returns `{ entries, count }`; each entry has a DSP `guid` and display `name`.

```javascript
const { entries } = await fb.discovery.getDspEntries();
```

### getOutputDevices()

Signature: `fb.discovery.getOutputDevices(): Promise<DiscoveryGetOutputDevicesResponse>`

Returns `{ devices, count }`. Discovery device descriptors currently contain only `guid`.

### getPreferencePages()

Signature: `fb.discovery.getPreferencePages(): Promise<DiscoveryGetPreferencePagesResponse>`

Returns `{ pages, count }`; each page includes `guid`, `parentGuid`, and `name`.

### getUIElements()

Signature: `fb.discovery.getUIElements(): Promise<DiscoveryGetUIElementsResponse>`

Returns `{ elements, count }`; each element includes `guid`, `subclassGuid`, `name`, `description`, and `isUserAddable`.

### searchCommands(query)

Signature: `fb.discovery.searchCommands(query: string): Promise<DiscoverySearchCommandsResponse>`

Searches main-menu commands and returns the echoed `query`, `results`, and `count`. The result `type` taxonomy currently uses `mainmenu`.

```javascript
const result = await fb.discovery.searchCommands('preferences');
```

<!-- END AUTO-GENERATED SDK STUBS -->
