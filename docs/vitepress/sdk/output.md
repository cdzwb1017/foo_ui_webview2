# fb.output Audio Output Discovery

`fb.output` exposes audio-output devices, output modules, and output settings.

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK Method Stubs

> This block maintains SDK-facing method coverage and may be expanded with complete examples and best practices.

### getEntries()

Signature: `fb.output.getEntries(): Promise<OutputGetEntriesResponse>`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| None | — | — | This method takes no arguments. |

Returns available output-module descriptors in `entries`. Each `OutputEntryInfo` includes `guid`, `name`, and capability flags such as `needsBitdepthConfig`, `supportsMultipleStreams`, `isHighLatency`, and `isLowLatency`.

```javascript
const { entries = [] } = await fb.output.getEntries();
```

### getSettings()

Signature: `fb.output.getSettings(): Promise<OutputGetSettingsResponse>`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| None | — | — | This method takes no arguments. |

Returns the host's output settings summary, including optional `availableOutputs` and `note` fields.

```javascript
const settings = await fb.output.getSettings();
```

<!-- END AUTO-GENERATED SDK STUBS -->

## Device List

`fb.output.getDevices(): Promise<OutputDevice[]>` invokes `output.getDevices` and unwraps the host's `{ devices, count }` envelope. A device includes `id`, `deviceId`, `outputId`, `name`, and `isCurrent`.

```javascript
const devices = await fb.output.getDevices();
const current = devices.find((device) => device.isCurrent);
```
