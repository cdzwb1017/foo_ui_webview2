<template>
  <div class="player">
    <!-- 封面 + 信息 -->
    <div class="player-info">
      <AlbumArt :src="playback.currentCover" class="player-cover" />
      <div class="player-details">
        <h3 class="track-title">{{ playback.currentTrack?.title || '未播放' }}</h3>
        <p class="track-artist">{{ playback.currentTrack?.artist || '-' }}</p>
        <p class="track-album">{{ playback.currentTrack?.album || '' }}</p>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="player-progress">
      <input
        type="range"
        :value="playback.position"
        :max="playback.duration || 100"
        @input="onSeek"
        class="progress-bar"
      />
      <div class="progress-time">
        <span class="time-current">{{ formatTime(playback.position) }}</span>
        <span class="time-total">{{ formatTime(playback.duration) }}</span>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="player-controls">
      <button @click="playback.previous" class="control-btn" title="上一首">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
        </svg>
      </button>
      <button @click="playback.playOrPause" class="control-btn play-btn" :title="playback.isPlaying ? '暂停' : '播放'">
        <svg v-if="playback.isPlaying" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>
      <button @click="playback.next" class="control-btn" title="下一首">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
        </svg>
      </button>
    </div>

    <!-- 音量 -->
    <div class="player-volume">
      <button @click="playback.toggleMute" class="volume-btn">
        <svg v-if="playback.isMuted || playback.volume === 0" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      </button>
      <input
        type="range"
        :value="playback.volume"
        min="0"
        max="100"
        @input="onVolumeChange"
        class="volume-slider"
      />
      <span class="volume-value">{{ playback.volume }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { usePlaybackStore } from '@/stores/playback';
import AlbumArt from './AlbumArt.vue';

const playback = usePlaybackStore();

// 时间格式化
function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// 进度拖动
// ⚠️ 易出错点 9: seek 参数是秒数，不是百分比
const onSeek = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const pos = Number(target.value);
  playback.seek(pos);
};

// 音量调整
// ⚠️ 易出错点 10: 音量范围是 0-100，不是 0-1
const onVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const vol = Number(target.value);
  playback.setVolume(vol);
};

// 初始化
onMounted(async () => {
  await playback.initialize();
  const cleanup = playback.setupEventListeners();

  // 组件卸载时清理事件监听
  onUnmounted(cleanup);
});
</script>

<style scoped>
.player {
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 12px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.player-cover {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.player-details {
  flex: 1;
  min-width: 0;
}

.track-title {
  font-size: 16px;
  font-weight: 500;
  color: white;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-artist {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-album {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-progress {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.1s;
}

.progress-bar::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.progress-time {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}

.control-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.play-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
}

.play-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.player-volume {
  display: flex;
  align-items: center;
  gap: 12px;
}

.volume-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-btn:hover {
  color: rgba(255, 255, 255, 0.9);
}

.volume-slider {
  flex: 1;
  max-width: 120px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.volume-value {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  min-width: 40px;
  text-align: right;
}
</style>
