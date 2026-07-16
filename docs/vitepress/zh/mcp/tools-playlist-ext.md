# Playlist Extended 工具 

播放列表扩展操作共 40 个工具，覆盖查询、排序、曲目增删、选区、焦点、撤销/重做、锁定及自动播放列表。

## 参数记法

- 不带 `?` 的参数是 MCP 输入 schema 的必填项。
- `playlist?: integer >= 0` 在映射后的 Bridge handler 中默认指向活动播放列表。
- 数组元素类型写在方括号中，例如 `paths: string[]`。
- 下表出现的 `newOrder`、`items` 和 `indices` 整数数组，其元素 schema 都声明最小值为 `0`。
- 下表列出的默认值会由 MCP 注册层在 Bridge 调用前应用。

## 查询与播放列表管理

| 工具 | Bridge 方法 | 参数 | 说明 |
| --- | --- | --- | --- |
| `fb2k_playlist_get_count` | `playlist.getCount` | 无 | 获取播放列表数量 |
| `fb2k_playlist_get_playing` | `playlist.getPlaying` | 无 | 获取正在播放的播放列表 |
| `fb2k_playlist_get_track_count` | `playlist.getTrackCount` | `playlist?: integer >= 0` | 获取指定播放列表的曲目数 |
| `fb2k_playlist_get_available_columns` | `playlist.getAvailableColumns` | 无 | 获取可用的播放列表列定义 |
| `fb2k_playlist_rename` | `playlist.rename` | `playlist: integer >= 0`、`name: string` | 重命名播放列表 |
| `fb2k_playlist_clear` | `playlist.clear` | `playlist?: integer >= 0` | 清空播放列表 |
| `fb2k_playlist_duplicate` | `playlist.duplicate` | `playlist?: integer >= 0`、`name?: string` | 复制播放列表；省略名称时由 Bridge 生成名称 |
| `fb2k_playlist_reorder_playlists` | `playlist.reorderPlaylists` | `newOrder: integer[]`，元素 >= `0` | 重排所有播放列表 |

## 曲目排序与移除

| 工具 | Bridge 方法 | 参数 | 说明 |
| --- | --- | --- | --- |
| `fb2k_playlist_insert_tracks` | `playlist.insertTracks` | `handles: string[]`、`playlist?: integer >= 0`、`position?: integer >= 0` | 插入曲目句柄 |
| `fb2k_playlist_remove_tracks` | `playlist.removeTracks` | `items: integer[]`、`playlist?: integer >= 0` | 按索引移除曲目 |
| `fb2k_playlist_remove_selected_tracks` | `playlist.removeSelectedTracks` | `playlist?: integer >= 0` | 移除选中的曲目 |
| `fb2k_playlist_move_tracks` | `playlist.moveTracks` | `delta: integer`、`playlist?: integer >= 0`、`items?: integer[]` | 按有符号偏移量移动曲目 |
| `fb2k_playlist_reorder` | `playlist.reorder` | `newOrder: integer[]`、`playlist?: integer >= 0` | 应用自定义曲目顺序 |
| `fb2k_playlist_reverse` | `playlist.reverse` | `playlist?: integer >= 0` | 反转曲目顺序 |
| `fb2k_playlist_sort` | `playlist.sort` | `playlist?: integer >= 0`、`pattern?: string = "%title%"`、`descending?: boolean = false`、`selectedOnly?: boolean = false` | 按 foobar2000 Title Formatting 模式排序 |
| `fb2k_playlist_shuffle` | `playlist.shuffle` | `playlist?: integer >= 0` | 随机打乱曲目顺序 |

::: tip Title Formatting 模式示例

- `%title%` — 按标题排序
- `%album artist% - %album% - %tracknumber%` — 按专辑+曲号排序
- `%rating%` — 按评分排序

:::

## 添加与替换曲目

| 工具 | Bridge 方法 | 参数 | 说明 |
| --- | --- | --- | --- |
| `fb2k_playlist_add_paths` | `playlist.addPaths` | `paths: string[]`、`playlist?: integer >= 0` | 添加文件路径 |
| `fb2k_playlist_add_handles` | `playlist.addHandles` | `handles: string[]`、`playlist?: integer >= 0` | 添加曲目句柄，不展开 CUE |
| `fb2k_playlist_add_paths_sequential` | `playlist.addPathsSequential` | `paths: string[]`、`playlist?: integer >= 0` | 按顺序添加路径 |
| `fb2k_playlist_add_paths_async` | `playlist.addPathsAsync` | `paths: string[]`、`playlist?: integer >= 0` | 异步添加路径 |
| `fb2k_playlist_replace_all_and_play` | `playlist.replaceAllAndPlay` | `paths: string[]`、`playlist?: integer >= 0`、`playIndex?: integer >= 0 = 0`、`stopFirst?: boolean = true`、`autoPlay?: boolean = true` | 原子替换播放列表内容，并按设置选择是否播放 |

## 选区与焦点

| 工具 | Bridge 方法 | 参数 | 说明 |
| --- | --- | --- | --- |
| `fb2k_playlist_get_selected_tracks` | `playlist.getSelectedTracks` | `playlist?: integer >= 0` | 获取选中曲目的详细信息 |
| `fb2k_playlist_get_selection` | `playlist.getSelection` | `playlist?: integer >= 0` | 获取选中曲目的索引 |
| `fb2k_playlist_set_selection` | `playlist.setSelection` | `indices: integer[]`、`playlist?: integer >= 0`、`clearOthers?: boolean = true` | 设置选中索引 |
| `fb2k_playlist_select_all` | `playlist.selectAll` | `playlist?: integer >= 0` | 选中全部曲目 |
| `fb2k_playlist_deselect_all` | `playlist.deselectAll` | `playlist?: integer >= 0` | 清空选区 |
| `fb2k_playlist_get_focused_track` | `playlist.getFocusedTrack` | `playlist?: integer >= 0` | 获取焦点曲目的索引 |
| `fb2k_playlist_set_focused_track` | `playlist.setFocusedTrack` | `index: integer >= 0`、`playlist?: integer >= 0` | 设置焦点曲目 |
| `fb2k_playlist_focus_track` | `playlist.focusTrack` | `playlist?: integer >= 0`、`index?: integer >= 0` | 已弃用的兼容工具；请改用 `fb2k_playlist_set_focused_track` |
| `fb2k_playlist_get_focus_track` | `playlist.getFocusTrack` | `playlist?: integer >= 0` | 已弃用的兼容工具；请改用 `fb2k_playlist_get_focused_track` |

## 撤销、重做与锁定

| 工具 | Bridge 方法 | 参数 | 说明 |
| --- | --- | --- | --- |
| `fb2k_playlist_undo` | `playlist.undo` | `playlist?: integer >= 0` | 撤销最近一次播放列表操作 |
| `fb2k_playlist_redo` | `playlist.redo` | `playlist?: integer >= 0` | 重做最近撤销的操作 |
| `fb2k_playlist_get_lock_info` | `playlist.getLockInfo` | `playlist?: integer >= 0` | 获取播放列表锁定信息 |
| `fb2k_playlist_is_locked` | `playlist.isLocked` | `playlist?: integer >= 0` | 检查播放列表是否锁定 |

## 自动播放列表

| 工具 | Bridge 方法 | 参数 | 说明 |
| --- | --- | --- | --- |
| `fb2k_playlist_is_autoplaylist` | `playlist.isAutoplaylist` | `playlist?: integer >= 0` | 检查播放列表是否为自动播放列表 |
| `fb2k_playlist_create_autoplaylist` | `playlist.createAutoplaylist` | `query: string`、`name?: string = "New Autoplaylist"`、`sort?: string`、`keepSorted?: boolean = false` | 根据 foobar2000 查询创建自动播放列表 |
| `fb2k_playlist_convert_to_autoplaylist` | `playlist.convertToAutoplaylist` | `query: string`、`playlist?: integer >= 0`、`sort?: string`、`keepSorted?: boolean = false` | 将现有播放列表转换为自动播放列表 |
| `fb2k_playlist_remove_autoplaylist` | `playlist.removeAutoplaylist` | `playlist?: integer >= 0` | 移除自动播放列表行为并保留曲目 |
| `fb2k_playlist_get_autoplaylist_info` | `playlist.getAutoplaylistInfo` | `playlist?: integer >= 0` | 获取自动播放列表详情 |
| `fb2k_playlist_get_autoplaylist_query` | `playlist.getAutoplaylistQuery` | `playlist?: integer >= 0` | 获取自动播放列表查询表达式 |

::: tip 查询语法
自动播放列表使用与 `library.search` 相同的 foobar2000 查询语言，例如 `artist IS Mili`。
:::
