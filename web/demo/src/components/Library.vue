<template>
  <div class="library">
    <!-- 搜索栏 -->
    <div class="library-header">
      <input
        v-model="library.searchQuery"
        @input="onSearch"
        type="text"
        placeholder="搜索媒体库..."
        class="search-input"
      />
    </div>

    <!-- 专辑网格 -->
    <div class="library-content">
      <div v-if="!library.searchQuery" class="album-grid">
        <div
          v-for="album in library.albums"
          :key="album.name + album.artist"
          @click="playAlbum(album)"
          class="album-card"
          :class="{ 'is-loading': library.isLoading }"
        >
          <AlbumArt :src="album.cover" class="album-cover" />
          <div class="album-info">
            <h4 class="album-name">{{ album.name }}</h4>
            <p class="album-artist">{{ album.artist }}</p>
            <p class="album-meta">
              {{ album.year || '' }} · {{ album.trackCount }} 首
            </p>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-else class="search-results">
        <div
          v-for="(track, _index) in library.searchResults"
          :key="track.absolutePath"
          @dblclick="playTrack(track)"
          class="search-result-item"
        >
          <div class="result-cover placeholder">
            🎵
          </div>
          <div class="result-info">
            <div class="result-title">{{ track.title }}</div>
            <div class="result-meta">
              {{ track.artist }} · {{ track.album }}
            </div>
          </div>
          <span class="result-duration">{{ formatDuration(track.duration) }}</span>
        </div>

        <div v-if="library.searchResults.length === 0 && !library.isLoading" class="empty-state">
          未找到匹配的结果
        </div>
      </div>

      <div v-if="library.isLoading" class="loading-state">
        加载中...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useLibraryStore } from '@/stores/library';
import AlbumArt from './AlbumArt.vue';

const library = useLibraryStore();

function formatDuration(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

async function onSearch() {
  await library.search(library.searchQuery);
}

async function playAlbum(album: any) {
  await library.playAlbum(album);
}

async function playTrack(track: any) {
  // 使用 absolutePath 播放单个曲目
  await library.search(`absolutePath IS "${track.absolutePath}"`);
}

onMounted(async () => {
  await library.loadAlbums();
});
</script>

<style scoped>
.library {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

.library-header {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 10px 14px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: all 0.15s;
}

.search-input:focus {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(0, 0, 0, 0.4);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.library-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.album-card {
  cursor: pointer;
  transition: transform 0.15s;
}

.album-card:hover {
  transform: translateY(-4px);
}

.album-cover {
  aspect-ratio: 1;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.album-info {
  padding: 0 4px;
}

.album-name {
  font-size: 13px;
  font-weight: 500;
  color: white;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-artist {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.album-meta {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.result-cover {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  font-size: 20px;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 13px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-meta {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-duration {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.empty-state,
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
}
</style>
