# fb.titleformat Titleformat

`fb.titleformat` evaluates foobar2000 Title Formatting expressions for one or more tracks. The namespace also exposes `eval()`, `evalBatch()`, `evalFields()`, and `getBuiltinFields()`.

<!-- BEGIN AUTO-GENERATED SDK STUBS -->

## SDK Method Stub

> This block records SDK method coverage and may later be expanded with complete examples and best practices.

### evalFieldsBatch()

Signature: `fb.titleformat.evalFieldsBatch(paths: string[], fields: Record<string, string>): Promise<TitleformatFieldsBatchResult>`

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| paths | string[] | Yes | Track paths to evaluate |
| fields | Record<string, string> | Yes | Map from each output key to its Title Formatting pattern |

Returns aggregate counts and one result per path. The host compiles the merged expression once before applying it across the batch.

```javascript
const result = await fb.titleformat.evalFieldsBatch(
	['E:\\Music\\one.flac', 'E:\\Music\\two.flac'],
	{ artist: '%artist%', title: '%title%' }
);
```

<!-- END AUTO-GENERATED SDK STUBS -->
