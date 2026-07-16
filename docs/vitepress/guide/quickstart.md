# Quick Start

## Minimal example

Save the following as `index.html` under the current active template directory, usually `profile/webview-ui/<active-template>/` (for the common starter this is `profile/webview-ui/default/`), then load that template:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My foobar2000 UI</title>
</head>
<body>
    <h1 id="track">Waiting for playback...</h1>
    <button id="play">▶ Play</button>
    <button id="prev">⏮ Previous</button>
    <button id="next">⏭ Next</button>

    <script>
    document.getElementById('play').onclick = () => fb2k.invoke('playback.playOrPause');
    document.getElementById('prev').onclick = () => fb2k.invoke('playback.previous');
    document.getElementById('next').onclick = () => fb2k.invoke('playback.next');

    fb2k.on('playback:trackChanged', (data) => {
        document.getElementById('track').textContent = data.artist + ' - ' + data.title;
    });
    </script>
</body>
</html>
```

> Native `window.fb2k` is injected by the component — no SDK file is required for `fb2k.invoke()` / `fb2k.on()`. For the higher-level `fb.*` wrappers (`fb.player.play()`, etc.), install `foo-webview-sdk` and load a published asset such as `bridge.global.js` (or import the ESM package from a bundler). The component does not auto-deploy an SDK directory under the active template.

## Bridge object

The component injects `window.fb2k`:

```javascript
window.fb2k = {
    invoke(method, params) → Promise<result>,  // call an API
    on(event, callback) → unsubscribe,         // subscribe to events
};
```

## Basic calls

```javascript
// 1. Call an API (all calls are async)
const result = await fb2k.invoke('playback.play');
console.log(result); // { success: true }

// 2. Get the current track
const track = await fb2k.invoke('playback.getCurrentTrack');
console.log(track.title, track.artist);

// 3. Listen for events
const unsubscribe = fb2k.on('playback:trackChanged', (data) => {
    console.log('Now playing:', data.title);
});
// unsubscribe later: unsubscribe();

// 4. Call with params (volume range 0-100)
await fb2k.invoke('playback.setVolume', { volume: 80 });
```

## Full player example

Initialize playback control listeners:

```javascript
async function initPlayer() {
    const state = await fb2k.invoke('playback.getState');
    updatePlayButton(state.state === 'playing');

    const volumeInfo = await fb2k.invoke('playback.getVolume');
    updateVolumeSlider(volumeInfo.volume);

    if (state.state === 'playing' || state.state === 'paused') {
        const track = await fb2k.invoke('playback.getCurrentTrack');
        updateTrackInfo(track);
    }
}
```

```javascript
document.getElementById('btn-play').onclick = async () => {
    await fb2k.invoke('playback.playOrPause');
};
document.getElementById('btn-prev').onclick = async () => {
    await fb2k.invoke('playback.previous');
};
document.getElementById('btn-next').onclick = async () => {
    await fb2k.invoke('playback.next');
};
```

```javascript
fb2k.on('playback:trackChanged', async (track) => {
    updateTrackInfo(track);
    const artwork = await fb2k.invoke('artwork.getCurrent');
    if (artwork.available) {
        document.getElementById('cover').src = artwork.dataUrl;
    }
});

fb2k.on('playback:stateChanged', (state) => {
    updatePlayButton(state.state === 'playing');
});

fb2k.on('playback:time', (data) => {
    const percent = (data.position / currentDuration) * 100;
    document.getElementById('progress-fill').style.width = percent + '%';
});
```

## Helpers

```javascript
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

function isStaticLocalFile(path) {
    if (!path) return false;
    return !path.startsWith('http://') &&
           !path.startsWith('https://') &&
           !path.startsWith('cdda://');
}
```
