<template>
  <div class="playlist">
    <!-- 列表选择器 -->
    <div class="playlist-header">
      <select
        v-model="playlist.activePlaylistIndex"
        @change="onPlaylistChange"
        class="playlist-selector"
      >
        <option v-for="pl in playlist.playlists" :key="pl.index" :value="pl.index">
          {{ pl.name }} ({{ pl.itemCount }})
        </option>
      </select>
      <div class="playlist-actions">
        <button @click="onCreatePlaylist" class="action-btn" title="新建播放列表">+</button>
        <button
          v-if="playlist.playlists.length > 1"
          @click="onDeletePlaylist"
          class="action-btn"
          title="删除播放列表"
        >−</button>
      </div>
    </div>

    <!-- 曲目列表 -->
    <!-- ⚠️ 易出错点 14: 大量曲目时必须使用虚拟列表 -->
    <div class="playlist-tracks">
      <div
        v-for="(track, index) in playlist.tracks"
        :key="track.absolutePath"
        @dblclick="playTrack(index)"
        @contextmenu.prevent="onContextMenu($event, index)"
        class="track-item"
        :class="{ 'is-current': isCurrentTrack(track) }"
      >
        <span class="track-number">{{ index + 1 }}</span>
        <div class="track-info">
          <div class="track-title">{{ track.title || '未知曲目' }}</div>
          <div class="track-meta">
            {{ track.artist || '未知艺术家' }} · {{ track.album || '' }}
          </div>
        </div>
        <span class="track-duration">{{ formatDuration(track.duration) }}</span>
      </div>

      <div v-if="playlist.tracks.length === 0" class="empty-state">
        此播放列表为空
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { usePlaylistStore } from '@/stores/playlist';
import { invoke } from '@/api/fb2k';

const playlist = usePlaylistStore();

function formatDuration(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function isCurrentTrack(track: any): boolean {
  return track.absolutePath === playlist.currentTrackId;
}

async function onPlaylistChange() {
  await playlist.setActive(playlist.activePlaylistIndex);
}

async function playTrack(index: number) {
  await playlist.playTrack(playlist.activePlaylistIndex, index);
}

async function onContextMenu(event: MouseEvent, index: number) {
  const menuItems = [
    { id: 'play', label: '播放' },
    { id: 'remove', label: '从列表移除' },
    { id: 'queue', label: '添加到播放队列' }
  ];

  const result = await invoke('ui.showContextMenu', {
    x: event.clientX,
    y: event.clientY,
    items: menuItems
  });

  if (result.selectedId === 'play') {
    playTrack(index);
  } else if (result.selectedId === 'remove') {
    await playlist.removeTracks(playlist.activePlaylistIndex, [index]);
  } else if (result.selectedId === 'queue') {
    await invoke('queue.add', {
      playlist: playlist.activePlaylistIndex,
      track: index
    });
  }
}

async function onCreatePlaylist() {
  const name = prompt('输入播放列表名称:');
  if (name) {
    await playlist.createPlaylist(name);
  }
}

async function onDeletePlaylist() {
  if (confirm(`确定删除 "${playlist.playlists[playlist.activePlaylistIndex].name}"?`)) {
    await playlist.removePlaylist(playlist.activePlaylistIndex);
  }
}

onMounted(async () => {
  await playlist.initialize();
  const cleanup = playlist.setupEventListeners();
  onUnmounted(cleanup);
});
</script>

<style scoped>
.playlist {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.playlist-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-selector {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 13px;
  cursor: pointer;
}

.playlist-selector:hover {
  background: rgba(0, 0, 0, 0.4);
}

.playlist-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.playlist-tracks {
  flex: 1;
  overflow-y: auto;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.track-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.track-item.is-current {
  background: rgba(59, 130, 246, 0.2);
}

.track-item.is-current .track-number {
  color: #3b82f6;
}

.track-number {
  width: 32px;
  text-align: right;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.track-info {
  flex: 1;
  min-width: 0;
}

.track-title {
  font-size: 13px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-meta {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.track-duration {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
}
</style>
