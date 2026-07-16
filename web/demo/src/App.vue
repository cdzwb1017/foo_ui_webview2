<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <TitleBar />

    <!-- 主内容区 -->
    <div class="app-content">
      <!-- 左侧：播放控制 + 播放列表 -->
      <div class="app-left">
        <Player class="player-section" />
        <Playlist class="playlist-section" />
      </div>

      <!-- 右侧：媒体库 -->
      <div class="app-right">
        <Library />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import TitleBar from './components/TitleBar.vue';
import Player from './components/Player.vue';
import Playlist from './components/Playlist.vue';
import Library from './components/Library.vue';
import { invoke } from '@/api/fb2k';

onMounted(async () => {
  // 设置 DWM 效果
  try {
    await invoke('window.setBackdrop', { type: 'mica' });
  } catch (error) {
    console.warn('Failed to set backdrop:', error);
  }
});
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-content {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.app-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.player-section {
  flex-shrink: 0;
}

.playlist-section {
  flex: 1;
  min-height: 0;
}

.app-right {
  flex: 1;
  min-width: 0;
}

@media (max-width: 768px) {
  .app-content {
    flex-direction: column;
    overflow-y: auto;
  }

  .app-left,
  .app-right {
    flex: none;
    height: auto;
  }
}
</style>
