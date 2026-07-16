import { defineStore } from 'pinia';
import { ref } from 'vue';
import { invoke, subscribe } from '@/api/fb2k';
import type { Playlist, Track } from '@/api/types';

export const usePlaylistStore = defineStore('playlist', () => {
  // 状态
  const playlists = ref<Playlist[]>([]);
  const activePlaylistIndex = ref<number>(0);
  const tracks = ref<Track[]>([]);
  const currentTrackId = ref<string>('');

  // 加载播放列表
  async function loadPlaylists() {
    try {
      const result = await invoke('playlist.getAll');
      playlists.value = result.playlists || result.items || [];

      // 找到活动播放列表
      const active = playlists.value.find(p => p.isActive);
      if (active) {
        activePlaylistIndex.value = active.index;
      }
    } catch (error) {
      console.error('Failed to load playlists:', error);
    }
  }

  // 加载曲目
  // ⚠️ 易出错点 15: getItems 有分页，大列表需要多次请求或设置大 limit
  async function loadTracks(playlistIndex?: number) {
    try {
      const index = playlistIndex ?? activePlaylistIndex.value;
      const result = await invoke('playlist.getTracks', {
        playlist: index,
        start: 0,
        count: 1000  // 根据需要调整
      });
      tracks.value = result.tracks || [];
    } catch (error) {
      console.error('Failed to load tracks:', error);
    }
  }

  // 切换播放列表
  async function setActive(index: number) {
    await invoke('playlist.setActive', { playlist: index });
    activePlaylistIndex.value = index;
    await loadPlaylists();
    await loadTracks(index);
  }

  // 播放曲目
  async function playTrack(playlistIndex: number, trackIndex: number) {
    await invoke('playlist.playTrack', {
      playlist: playlistIndex,
      track: trackIndex
    });
  }

  // 移除曲目
  async function removeTracks(playlistIndex: number, indices: number[]) {
    await invoke('playlist.remove', {
      playlist: playlistIndex,
      indices
    });
    await loadTracks(playlistIndex);
  }

  // 创建播放列表
  async function createPlaylist(name: string) {
    await invoke('playlist.create', { name });
    await loadPlaylists();
  }

  // 删除播放列表
  async function removePlaylist(index: number) {
    await invoke('playlist.remove', { playlist: index });
    await loadPlaylists();
  }

  // 重命名播放列表
  async function renamePlaylist(index: number, name: string) {
    await invoke('playlist.rename', { playlist: index, name });
    await loadPlaylists();
  }

  // 设置事件监听
  function setupEventListeners() {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      subscribe('playback:trackChanged', (data) => {
        currentTrackId.value = data.id || data.absolutePath || data.path;
      }),

      subscribe('playlist:itemsChanged', (_data) => {
        loadTracks(activePlaylistIndex.value);
      }),

      subscribe('playlist:playlistsChanged', () => {
        loadPlaylists();
      }),

      subscribe('playlist:switched', (data) => {
        activePlaylistIndex.value = data.index;
        loadTracks(data.index);
      })
    );

    // 返回清理函数
    return () => {
      unsubscribers.forEach(fn => fn());
    };
  }

  // 初始化
  async function initialize() {
    await loadPlaylists();
    await loadTracks();

    // 获取当前播放曲目
    try {
      const current = await invoke('playback.getCurrentTrack');
      if (current.track) {
        currentTrackId.value = current.track.id || current.track.absolutePath || current.track.path;
      }
    } catch (error) {
      console.error('Failed to get current track:', error);
    }
  }

  return {
    // 状态
    playlists,
    activePlaylistIndex,
    tracks,
    currentTrackId,

    // 方法
    loadPlaylists,
    loadTracks,
    setActive,
    playTrack,
    removeTracks,
    createPlaylist,
    removePlaylist,
    renamePlaylist,
    setupEventListeners,
    initialize
  };
});
