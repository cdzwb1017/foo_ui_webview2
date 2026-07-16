import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { invoke, subscribe } from '@/api/fb2k';
import type { Track, PlaybackState } from '@/api/types';

export const usePlaybackStore = defineStore('playback', () => {
  // 状态
  const currentTrack = ref<Track | null>(null);
  const currentCover = ref<string>('');
  const playbackState = ref<PlaybackState>('stopped');
  const position = ref<number>(0);
  const duration = ref<number>(0);
  const volume = ref<number>(100);
  const isMuted = ref<boolean>(false);

  // 计算属性
  const isPlaying = computed(() => playbackState.value === 'playing');
  const isPaused = computed(() => playbackState.value === 'paused');
  const isStopped = computed(() => playbackState.value === 'stopped');

  // 加载封面
  async function loadCover() {
    try {
      // 使用新的 getCurrent API（自动处理路径）
      const result = await invoke('artwork.getCurrent', { type: 'front' });
      if (result.available && result.dataUrl) {
        // ⚠️ 易出错点 11: 新版本 API 已返回 dataUrl，直接使用
        currentCover.value = result.dataUrl;
      } else {
        currentCover.value = '';
      }
    } catch {
      currentCover.value = '';
    }
  }

  // 初始化状态
  async function initialize() {
    try {
      const [trackInfo, volumeInfo, posInfo] = await Promise.all([
        invoke('playback.getCurrentTrack'),
        invoke('playback.getVolume'),
        invoke('playback.getPosition')
      ]);

      if (trackInfo.isPlaying !== undefined) {
        playbackState.value = trackInfo.isPlaying ? 'playing' :
                              trackInfo.isPaused ? 'paused' : 'stopped';
      }

      if (trackInfo.track) {
        currentTrack.value = trackInfo.track;
        duration.value = trackInfo.track.duration || 0;
        loadCover();
      }

      volume.value = volumeInfo.volume ?? 100;
      isMuted.value = volumeInfo.isMuted ?? false;
      position.value = posInfo.position ?? 0;
    } catch (error) {
      console.error('Failed to initialize playback state:', error);
    }
  }

  // 设置事件监听
  function setupEventListeners() {
    const unsubscribers: (() => void)[] = [];

    // ⚠️ 易出错点 12: 必须订阅正确的事件名称
    unsubscribers.push(
      subscribe('playback:trackChanged', (data) => {
        currentTrack.value = data;
        duration.value = data.duration || 0;
        loadCover();
      }),

      subscribe('playback:stateChanged', (data) => {
        playbackState.value = data.state;
      }),

      // ⚠️ 易出错点 13: positionChanged 可能非常频繁，考虑节流
      subscribe('playback:time', (data) => {
        position.value = data.position;
      }),

      subscribe('playback:volumeChanged', (data) => {
        volume.value = data.volume;
        isMuted.value = data.isMuted;
      })
    );

    // 返回清理函数
    return () => {
      unsubscribers.forEach(fn => fn());
    };
  }

  // 播放控制方法
  async function play() {
    await invoke('playback.play');
  }

  async function pause() {
    await invoke('playback.pause');
  }

  async function playOrPause() {
    await invoke('playback.playOrPause');
  }

  async function stop() {
    await invoke('playback.stop');
  }

  async function next() {
    await invoke('playback.next');
  }

  async function previous() {
    await invoke('playback.previous');
  }

  // 进度控制
  async function seek(pos: number) {
    // ⚠️ 易出错点 9: seek 参数是秒数，不是百分比
    await invoke('playback.setPosition', { position: pos });
  }

  // 音量控制
  // ⚠️ 易出错点 10: 音量范围是 0-100，不是 0-1
  async function setVolume(vol: number) {
    await invoke('playback.setVolume', { volume: vol });
  }

  async function toggleMute() {
    await invoke('playback.toggleMute');
  }

  // 播放模式
  async function getPlaybackOrder() {
    const result = await invoke('playback.getPlaybackOrder');
    return result.order;
  }

  async function setPlaybackOrder(order: number) {
    await invoke('playback.setPlaybackOrder', { order });
  }

  return {
    // 状态
    currentTrack,
    currentCover,
    playbackState,
    position,
    duration,
    volume,
    isMuted,

    // 计算属性
    isPlaying,
    isPaused,
    isStopped,

    // 方法
    initialize,
    setupEventListeners,
    play,
    pause,
    playOrPause,
    stop,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    getPlaybackOrder,
    setPlaybackOrder
  };
});
