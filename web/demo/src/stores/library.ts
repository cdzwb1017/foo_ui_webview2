import { defineStore } from 'pinia';
import { ref } from 'vue';
import { invoke } from '@/api/fb2k';
import type { Album } from '@/api/types';
import { isStaticLocalFile } from '@/api/types';

export const useLibraryStore = defineStore('library', () => {
  // 状态
  const albums = ref<Album[]>([]);
  const searchQuery = ref<string>('');
  const searchResults = ref<any[]>([]);
  const isLoading = ref<boolean>(false);

  // 加载专辑
  // ⚠️ 易出错点 16: 媒体库可能很大，首次加载可能较慢
  async function loadAlbums() {
    isLoading.value = true;
    try {
      const result = await invoke('library.getAlbums', {
        sort: 'year',
        limit: 30,
        useCache: true        // 使用缓存加速
      });

      albums.value = [];

      // ⚠️ 易出错点 17: 封面获取是异步的，需要逐个处理
      for (const a of result.albums || []) {
        let coverSrc = '';

        // 只为静态文件获取封面
        if (a.firstTrackAbsolutePath && isStaticLocalFile(a.firstTrackAbsolutePath)) {
          try {
            const artwork = await invoke('artwork.getForTrack', {
              path: a.firstTrackAbsolutePath,  // ✅ 使用 absolutePath
              type: 'front'
            });
            if (artwork.available && artwork.dataUrl) {
              coverSrc = artwork.dataUrl;
            }
          } catch {
            // 封面获取失败，使用默认占位图
          }
        }

        albums.value.push({
          ...a,
          cover: coverSrc
        });
      }
    } catch (error) {
      console.error('Failed to load albums:', error);
    } finally {
      isLoading.value = false;
    }
  }

  // 搜索
  // ⚠️ 易出错点 18: 搜索需要防抖，避免频繁请求
  let searchTimeout: number | null = null;
  async function search(query: string) {
    searchQuery.value = query;

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    return new Promise((resolve) => {
      searchTimeout = window.setTimeout(async () => {
        if (!query.trim()) {
          searchResults.value = [];
          resolve([]);
          return;
        }

        isLoading.value = true;
        try {
          const result = await invoke('library.search', {
            query: query,
            limit: 50
          });
          searchResults.value = result.tracks || [];
          resolve(result.tracks || []);
        } catch (error) {
          console.error('Search failed:', error);
          searchResults.value = [];
          resolve([]);
        } finally {
          isLoading.value = false;
        }
      }, 300);
    });
  }

  // 获取专辑曲目
  async function getAlbumTracks(albumName: string, artist: string) {
    try {
      const result = await invoke('library.search', {
        query: `album IS "${albumName}" AND artist IS "${artist}"`,
        limit: 100
      });
      return result.tracks || [];
    } catch (error) {
      console.error('Failed to get album tracks:', error);
      return [];
    }
  }

  // 播放专辑
  // ⚠️ 易出错点 19: 使用 search 获取专辑曲目，然后播放
  async function playAlbum(album: Album) {
    try {
      const result = await invoke('library.search', {
        query: `album IS "${album.name}" AND artist IS "${album.artist}"`,
        limit: 100
      });

      if (result.tracks?.length > 0) {
        // ⚠️ 易出错点 20: 使用 absolutePath 播放，确保兼容性
        const paths = result.tracks.map((t: any) => t.absolutePath);

        // 替换当前播放列表并播放（原子操作）
        await invoke('playlist.playPaths', {
          paths,
          replace: true  // 替换而非追加
        });
      }
    } catch (error) {
      console.error('Failed to play album:', error);
    }
  }

  // 获取艺术家列表
  async function getArtists() {
    try {
      const result = await invoke('library.getArtists', {
        limit: 100
      });
      return result.artists || [];
    } catch (error) {
      console.error('Failed to get artists:', error);
      return [];
    }
  }

  // 获取艺术家专辑
  async function getArtistAlbums(artist: string) {
    try {
      const result = await invoke('library.search', {
        query: `artist IS "${artist}"`,
        limit: 100
      });
      return result.tracks || [];
    } catch (error) {
      console.error('Failed to get artist albums:', error);
      return [];
    }
  }

  return {
    // 状态
    albums,
    searchQuery,
    searchResults,
    isLoading,

    // 方法
    loadAlbums,
    search,
    getAlbumTracks,
    playAlbum,
    getArtists,
    getArtistAlbums
  };
});
