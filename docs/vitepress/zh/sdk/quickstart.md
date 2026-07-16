# SDK 快速入门

## 最小示例

```html
<!DOCTYPE html>
<html>
<head>
    <script src="bridge.global.js"></script>
    <script src="components.global.js"></script>
</head>
<body>
    <!-- components.global.js 会自动注册这些元素。 -->
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

## ES module 设置

```javascript
import fb from 'foo-webview-sdk';
import { registerComponents } from 'foo-webview-sdk/components';

registerComponents();
await fb.ready();
```

## 完整播放器示例

```javascript
async function init() {
    // 获取当前曲目
    const track = await fb.player.getCurrentTrack();
    if (track) updateUI(track);

    // 获取所有播放列表
    const playlists = await fb.playlist.getAll();
    renderPlaylists(playlists);

    // 订阅事件
    fb.on('playback:trackChanged', updateUI);
    fb.on('playback:stateChanged', updatePlaybackState);
}

// 播放控制
document.getElementById('playBtn').onclick = () => fb.player.toggle();
document.getElementById('prevBtn').onclick = () => fb.player.prev();
document.getElementById('nextBtn').onclick = () => fb.player.next();

// 音量控制 (0-100)
document.getElementById('volumeSlider').oninput = (e) => {
    fb.player.setVolume(Number(e.target.value));
};

init();
```

`fb.on()` 会返回取消订阅函数。若订阅的生命周期短于页面生命周期，请保留并在不再需要时调用它：

```javascript
const off = fb.on('playback:time', ({ position }) => {
    renderPosition(position);
});

// 稍后取消订阅：
off();
```
