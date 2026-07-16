# SDK quick start

## Minimal script-tag example

```html
<!DOCTYPE html>
<html>
<head>
    <script src="bridge.global.js"></script>
    <script src="components.global.js"></script>
</head>
<body>
    <!-- components.global.js registers these elements automatically. -->
    <fb-play-button></fb-play-button>
    <fb-prev-button></fb-prev-button>
    <fb-next-button></fb-next-button>
    <fb-seek-bar></fb-seek-bar>
    <fb-volume-control></fb-volume-control>

    <script>
        fb.on('playback:trackChanged', (track) => {
            document.title = `${track.title} - ${track.artist}`;
        });
    </script>
</body>
</html>
```

## ES module setup

```javascript
import fb from 'foo-webview-sdk';
import { registerComponents } from 'foo-webview-sdk/components';

registerComponents();
await fb.ready();
```

## Player example

```javascript
async function init() {
    // Read the current track. The SDK returns null when nothing is loaded.
    const track = await fb.player.getCurrentTrack();
    if (track) updateUI(track);

    // Read all playlists.
    const playlists = await fb.playlist.getAll();
    renderPlaylists(playlists);

    // Subscribe to typed host events.
    fb.on('playback:trackChanged', updateUI);
    fb.on('playback:stateChanged', updatePlaybackState);
}

// Playback controls.
document.getElementById('playBtn').onclick = () => fb.player.toggle();
document.getElementById('prevBtn').onclick = () => fb.player.prev();
document.getElementById('nextBtn').onclick = () => fb.player.next();

// Linear volume control (0-100).
document.getElementById('volumeSlider').oninput = (e) => {
    fb.player.setVolume(Number(e.target.value));
};

init();
```

`fb.on()` returns an unsubscribe function. Keep it when the subscription has a shorter lifetime than the page:

```javascript
const off = fb.on('playback:time', ({ position }) => {
    renderPosition(position);
});

// Later:
off();
```
