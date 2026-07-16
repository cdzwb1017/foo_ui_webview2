# Components Overview

foo_ui_webview2 ships **36 unstyled Web Components**. They are functional building blocks with no visual opinion, designed to be customized through CSS Parts, slots, and custom events.

## Quick Start

Install the published SDK when using a bundler:

```bash
npm install foo-webview-sdk
```

Import the ESM component entry and register the elements explicitly:

```js
import { registerComponents } from 'foo-webview-sdk/components';

registerComponents();
```

For a plain `<script>` setup, copy or otherwise serve the published global bundles and load the bridge before the component bundle. `components.global.js` registers every component automatically.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="./theme.css" />
  </head>
  <body>
    <!-- These paths are examples for locally served published bundles. -->
    <script src="./sdk/dist/bridge.global.js"></script>
    <script src="./sdk/dist/components.global.js"></script>

    <!-- Components are registered when components.global.js loads. -->
    <fb-play-button></fb-play-button>
    <fb-seek-bar></fb-seek-bar>
    <fb-volume-control></fb-volume-control>
    <fb-track-text tf="%title% — %artist%"></fb-track-text>
  </body>
</html>
```

The component installer does not create an SDK directory. The example paths above assume that the published files have been copied into your theme's served tree.

## Design Principles

- **No visual opinion** — components avoid visual properties such as `color`, `background`, and `font-family`; the theme supplies their appearance through exposed hooks
- **CSS Parts** — styleable internal elements expose `part` names for `::part()` selectors
- **Slots** — icons, placeholders, and other replaceable content use `<slot>`
- **Event driven** — component `CustomEvent` objects cross the Shadow DOM boundary with `bubbles: true` and `composed: true`

### Styling Example

Use the CSS hooks exposed by each component:

```css
/* Circular green play button */
fb-play-button::part(button) {
    background: #1db954;
    border: none;
    border-radius: 50%;
    color: white;
    width: 48px;
    height: 48px;
    cursor: pointer;
}
fb-play-button::part(button):hover {
    background: #1ed760;
}

/* Seek bar */
fb-seek-bar::part(track) { background: #333; height: 4px; }
fb-seek-bar::part(fill) { background: #1db954; height: 4px; }
fb-seek-bar::part(thumb) { background: #fff; width: 12px; height: 12px; }

/* Rating stars */
fb-rating::part(star) {
    color: #888;
    font-size: 20px;
    cursor: pointer;
}
fb-rating::part(star)[data-filled] {
    color: #ffc107;
}
```

## Component Reference

### A. Playback Controls (7)

| Tag | Description |
| --- | --- |
| [`<fb-play-button>`](./play-controls#fb-play-button) | Play/pause toggle |
| [`<fb-stop-button>`](./play-controls#fb-stop-button) | Stop playback |
| [`<fb-prev-button>`](./play-controls#fb-prev-button) | Previous track |
| [`<fb-next-button>`](./play-controls#fb-next-button) | Next track |
| [`<fb-shuffle-button>`](./play-controls#fb-shuffle-button) | Shuffle toggle |
| [`<fb-repeat-button>`](./play-controls#fb-repeat-button) | Repeat cycle (`off` → `playlist` → `track`) |
| [`<fb-stop-after-current>`](./play-controls#fb-stop-after-current) | Stop after the current track |

### B. Progress and Volume (3)

| Tag | Description |
| --- | --- |
| [`<fb-seek-bar>`](./progress#fb-seek-bar) | Playback seek bar |
| [`<fb-volume-control>`](./progress#fb-volume-control) | Volume slider with mute control |
| [`<fb-playback-order>`](./progress#fb-playback-order) | Seven-state playback-order picker in select or button mode |

### C. Track Information (6)

| Tag | Description |
| --- | --- |
| [`<fb-track-text>`](./track-info#fb-track-text) | Track text from a field or Title Formatting expression |
| [`<fb-cover-art>`](./track-info#fb-cover-art) | Cover art with an optional SDK URL-helper lookup and standard artwork fallback |
| [`<fb-time-current>`](./track-info#fb-time-current) | Current playback time |
| [`<fb-time-total>`](./track-info#fb-time-total) | Total duration |
| [`<fb-time-remaining>`](./track-info#fb-time-remaining) | Remaining time |
| [`<fb-tech-info>`](./track-info#fb-tech-info) | Codec, bitrate, sample rate, and channel information |

### D. Playlists (5)

| Tag | Description |
| --- | --- |
| [`<fb-playlist-tabs>`](./playlist#fb-playlist-tabs) | Playlist tab strip |
| [`<fb-resizable-header>`](./playlist#fb-resizable-header) | Resizable, reorderable, sortable column header |
| [`<fb-playlist-view>`](./playlist#fb-playlist-view) | Virtualized playlist view |
| [`<fb-queue-view>`](./playlist#fb-queue-view) | Playback queue view |
| [`<fb-playlist-selector>`](./playlist#fb-playlist-selector) | Playlist dropdown |

### E. Window Management (3)

| Tag | Description |
| --- | --- |
| [`<fb-titlebar>`](./window#fb-titlebar) | Custom draggable title bar |
| [`<fb-window-controls>`](./window#fb-window-controls) | Minimize, maximize/restore, and close controls |
| [`<fb-popup-panel>`](./window#fb-popup-panel) | Popup-window trigger and lifecycle wrapper |

### F. Lyrics and Visualization (3)

| Tag | Description |
| --- | --- |
| [`<fb-lyrics-panel>`](./media#fb-lyrics-panel) | Synchronized or plain-text lyrics panel |
| [`<fb-spectrum-visualizer>`](./media#fb-spectrum-visualizer) | Real-time spectrum visualizer |
| [`<fb-waveform>`](./media#fb-waveform) | Full-track waveform overview |

### G. Rating and Audio Settings (4)

| Tag | Description |
| --- | --- |
| [`<fb-rating>`](./audio#fb-rating) | Star rating control |
| [`<fb-output-selector>`](./audio#fb-output-selector) | Audio output selector |
| [`<fb-dsp-preset-selector>`](./audio#fb-dsp-preset-selector) | DSP preset selector |
| [`<fb-replaygain-selector>`](./audio#fb-replaygain-selector) | ReplayGain mode selector |

### H. Metadata and Search (3)

| Tag | Description |
| --- | --- |
| [`<fb-properties-panel>`](./metadata#fb-properties-panel) | Read-only track properties panel |
| [`<fb-search-bar>`](./metadata#fb-search-bar) | Media-library search input |
| [`<fb-console>`](./metadata#fb-console) | foobar2000 console viewer |

### I. Media Library (2)

| Tag | Description |
| --- | --- |
| [`<fb-library-tree>`](./library#fb-library-tree) | Artist, album, or genre grouping tree |
| [`<fb-library-filesystem-tree>`](./library#fb-library-filesystem-tree) | Lazily loaded filesystem-style media-library root tree |
