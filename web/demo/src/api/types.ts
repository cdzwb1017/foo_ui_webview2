/**
 * 曲目信息
 *
 * ⚠️ 重要：路径字段说明
 * - path: foobar2000 内部路径（可能是 file-relative:// 等特殊格式）
 * - absolutePath: 本地文件系统绝对路径（推荐用于文件操作）
 *
 * 始终使用 absolutePath 进行文件操作（如获取封面）
 */
export interface Track {
  id: string;              // 唯一标识（通常是 absolutePath）
  title: string;
  artist: string;
  album: string;
  albumArtist?: string;
  duration: number;        // 秒
  path: string;            // 内部路径（不推荐直接使用）
  absolutePath: string;    // 绝对路径（推荐使用）
  index?: number;          // 播放列表中的索引
}

/**
 * 播放列表信息
 */
export interface Playlist {
  index: number;
  name: string;
  itemCount: number;
  isActive: boolean;
}

/**
 * 专辑信息
 */
export interface Album {
  name: string;
  artist: string;
  trackCount: number;
  year?: number;
  firstTrackAbsolutePath?: string;
  cover?: string;          // Base64 封面或 dataUrl
}

/**
 * 播放状态
 */
export type PlaybackState = 'playing' | 'paused' | 'stopped';

/**
 * 播放模式
 * ⚠️ 易出错点 5: 播放模式是数字，不是字符串
 */
export enum PlaybackOrder {
  Default = 0,
  RepeatPlaylist = 1,
  RepeatTrack = 2,
  Random = 3,
  ShuffleTracks = 4,
  ShuffleAlbums = 5,
  ShuffleFolders = 6
}

/**
 * 判断是否为静态本地文件
 * ⚠️ 重要：只有静态本地文件才能获取封面
 */
export function isStaticLocalFile(path: string): boolean {
  if (!path) return false;
  // 排除网络流
  if (path.startsWith('http://') || path.startsWith('https://')) return false;
  // 排除 CD 音轨
  if (path.startsWith('cdda://')) return false;
  return true;
}
