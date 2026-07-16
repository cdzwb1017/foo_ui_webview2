# Panel Modes

> foo_ui_webview2 supports three run modes for different deployment scenarios.

## Overview

| Mode | Class | Interface | Notes |
| --- | --- | --- | --- |
| Standalone window | MainWindow | - | Replaces the default UI with full window control |
| DUI panel | WebViewDuiElement | ui_element | Embeds into Default UI layouts |
| CUI panel | WebViewCuiPanel | uie::window | Embeds into Columns UI layouts |

All modes share the same APIs and frontend code, but **some window-control APIs are unavailable in panel modes**.

## Standalone mode

`Webview2 UI` fully replaces foobar2000's default UI when selected as the Default User Interface.

- Full window control (maximize, minimize, close, drag)
- DWM effects (`window.setMica`, `window.setAcrylic`)
- Custom caption bar and fullscreen
- All Window APIs available

## DUI panel mode (Default UI)

Use WebView2 as a UI Element inside Default UI.

**How to use:**

1. Make sure Default UI is active
2. `View` → `Layout` → `Enable Layout Editing Mode`
3. Right-click empty space → `Add new UI element` → `WebView2 Panel`

**Notes:**

- After changing panel config in layout editing mode, WebView hides until you leave editing mode
- The config dialog is independent of the panel host window; layout changes do not tear down the dialog
- A panel may set `templateName` to load `profile/webview-ui/<templateName>/` instead of the global active template

## CUI panel mode (Columns UI)

Use WebView2 as a Panel inside Columns UI.

**How to use:**

1. Install the Columns UI component
2. `View` → `Columns UI` → `Layout`
3. Add `WebView2 Panel` from the panel list

## Mode detection

Actively call `window.getMode` at startup and whenever you need the current host mode. Read `mode`, `panelMode`, and `windowId` from the result.

DUI/CUI panels may also emit `panel:initialized` with the same three fields as an asynchronous notification. Standalone mode does **not** wait for that event — treat the event as complementary, not as a replacement for `window.getMode`.

```javascript
async function detectMode() {
    const info = await fb2k.invoke('window.getMode');
    // info.mode: 'standalone' | 'dui' | 'cui' | ...
    // info.panelMode: boolean
    // info.windowId: string
    return info;
}

// Optional async notification for DUI/CUI panels
fb2k.on('panel:initialized', (data) => {
    // data.mode, data.panelMode, data.windowId
    if (data.panelMode) {
        document.body.classList.add('panel-mode');
        document.body.classList.add(`mode-${data.mode}`);
    }
});

const current = await detectMode();
console.log(current.mode, current.panelMode, current.windowId);
```

## API compatibility matrix

| API | Standalone | DUI panel | CUI panel |
| --- | --- | --- | --- |
| window.minimize | ✓ | ✗ | ✗ |
| window.maximize | ✓ | ✗ | ✗ |
| window.setMica | ✓ | ✗ | ✗ |
| window.setAcrylic | ✓ | ✗ | ✗ |
| window.setCornerPreference | ✓ | ✗ | ✗ |
| window.startDrag | ✓ | ✗ | ✗ |
| window.getMode | ✓ | ✓ | ✓ |
| playback.* | ✓ | ✓ | ✓ |
| playlist.* | ✓ | ✓ | ✓ |
| library.* | ✓ | ✓ | ✓ |
| artwork.* | ✓ | ✓ | ✓ |
| config.* | ✓ | ✓ | ✓ |
| metadata.* | ✓ | ✓ | ✓ |

There is no combined DWM effect setter API. Use the registered helpers window.setMica and window.setAcrylic.

## Best practices

```javascript
const modeInfo = await fb2k.invoke('window.getMode');
if (modeInfo.panelMode) {
    document.body.classList.add('panel-mode');
    document.body.classList.add(`mode-${modeInfo.mode}`);
}

fb2k.on('panel:initialized', (data) => {
    if (data.panelMode) {
        document.body.classList.add('panel-mode');
        document.body.classList.add(`mode-${data.mode}`);
    }
});
```

```css
/* Hide chrome that only makes sense in standalone mode */
.panel-mode .title-bar,
.panel-mode .window-controls {
    display: none !important;
}
.panel-mode .main-content {
    padding-top: 0;
}
```
