# SDK overview and installation

The **foo_ui_webview2 SDK** is a typed, high-level facade over the native bridge. It turns direct `window.fb2k.invoke()` calls into concise namespace methods and provides typed events, reactive state, and optional Web Components.

## Native bridge versus SDK

| Native bridge | SDK facade |
| --- | --- |
| `window.fb2k.invoke('playback.play', {})` | `fb.player.play()` |
| `window.fb2k.invoke('playlist.addPaths', { playlist: 0, paths: [...] })` | `fb.playlist.add(0, paths)` |
| `window.fb2k.invoke('playback.setVolume', { volume: 80 })` | `fb.player.setVolume(80)` |

## Package entry points

The npm package is named `foo-webview-sdk`. Its public exports are:

| Import | Purpose |
| --- | --- |
| `foo-webview-sdk` | Aggregate `fb` object, namespace exports, bridge, state, and public types |
| `foo-webview-sdk/bridge` | The same bridge runtime surface |
| `foo-webview-sdk/components` | Web Component classes and explicit registration helpers |
| `foo-webview-sdk/smp-compat` | Spider Monkey Panel compatibility layer |
| `foo-webview-sdk/bridge.global` | IIFE bundle that installs `window.fb` |
| `foo-webview-sdk/components.global` | IIFE bundle that registers all shipped `fb-*` elements |
| `foo-webview-sdk/smp-compat.global` | IIFE compatibility bundle |

## Installation

```shell
npm install foo-webview-sdk
```

### ES modules

```javascript
import fb from 'foo-webview-sdk';
import { registerComponents } from 'foo-webview-sdk/components';

registerComponents();
await fb.player.play();
```

Importing `foo-webview-sdk/components` does not register elements automatically. Call `registerComponents()` when using the ESM entry.

### Direct script loading

When the built IIFE files are served with a theme, load the global bundles:

```html
<script src="./sdk/bridge.global.js"></script>
<script src="./sdk/components.global.js"></script>

<fb-play-button></fb-play-button>
<script>
  fb.player.play();
</script>
```

The component IIFE registers all bundled custom elements as a load-time side effect.

## Availability

```javascript
if (fb.isAvailable()) {
    console.log('The native bridge is ready');
    await fb.player.play();
} else {
    console.log('The SDK is using its mock fallback');
}
```

`fb.ready()` resolves when a late-injected native bridge becomes available. Outside the host, namespace calls use the SDK's mock response path instead of reaching foobar2000.
