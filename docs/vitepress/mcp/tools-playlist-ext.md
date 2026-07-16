# Playlist Extended Tools

Forty tools cover playlist inspection, ordering, track insertion and removal, selection, focus, undo/redo, locking, and autoplaylists.

## Parameter notation

- A parameter without `?` is required by the MCP input schema.
- `playlist?: integer >= 0` defaults to the active playlist in the mapped Bridge handler.
- Array element types are shown in brackets, such as `paths: string[]`.
- The `newOrder`, `items`, and `indices` integer-array item schemas declare a minimum of `0` wherever those fields appear below.
- Defaults shown below are applied by MCP registration before the Bridge call.

## Queries and playlist management

| Tool | Bridge method | Parameters | Description |
| --- | --- | --- | --- |
| `fb2k_playlist_get_count` | `playlist.getCount` | none | Get the number of playlists |
| `fb2k_playlist_get_playing` | `playlist.getPlaying` | none | Get the playing playlist |
| `fb2k_playlist_get_track_count` | `playlist.getTrackCount` | `playlist?: integer >= 0` | Get a playlist's track count |
| `fb2k_playlist_get_available_columns` | `playlist.getAvailableColumns` | none | Get available playlist-column definitions |
| `fb2k_playlist_rename` | `playlist.rename` | `playlist: integer >= 0`, `name: string` | Rename a playlist |
| `fb2k_playlist_clear` | `playlist.clear` | `playlist?: integer >= 0` | Clear a playlist |
| `fb2k_playlist_duplicate` | `playlist.duplicate` | `playlist?: integer >= 0`, `name?: string` | Duplicate a playlist; the Bridge derives a name when omitted |
| `fb2k_playlist_reorder_playlists` | `playlist.reorderPlaylists` | `newOrder: integer[]` with items >= `0` | Reorder all playlists |

## Track ordering and removal

| Tool | Bridge method | Parameters | Description |
| --- | --- | --- | --- |
| `fb2k_playlist_insert_tracks` | `playlist.insertTracks` | `handles: string[]`, `playlist?: integer >= 0`, `position?: integer >= 0` | Insert track handles |
| `fb2k_playlist_remove_tracks` | `playlist.removeTracks` | `items: integer[]`, `playlist?: integer >= 0` | Remove tracks by index |
| `fb2k_playlist_remove_selected_tracks` | `playlist.removeSelectedTracks` | `playlist?: integer >= 0` | Remove selected tracks |
| `fb2k_playlist_move_tracks` | `playlist.moveTracks` | `delta: integer`, `playlist?: integer >= 0`, `items?: integer[]` | Move tracks by a signed offset |
| `fb2k_playlist_reorder` | `playlist.reorder` | `newOrder: integer[]`, `playlist?: integer >= 0` | Apply a custom track order |
| `fb2k_playlist_reverse` | `playlist.reverse` | `playlist?: integer >= 0` | Reverse track order |
| `fb2k_playlist_sort` | `playlist.sort` | `playlist?: integer >= 0`, `pattern?: string = "%title%"`, `descending?: boolean = false`, `selectedOnly?: boolean = false` | Sort with a foobar2000 title-format pattern |
| `fb2k_playlist_shuffle` | `playlist.shuffle` | `playlist?: integer >= 0` | Shuffle track order |

Title-format examples include `%title%`, `%album artist% - %album% - %tracknumber%`, and `%rating%`.

## Adding and replacing tracks

| Tool | Bridge method | Parameters | Description |
| --- | --- | --- | --- |
| `fb2k_playlist_add_paths` | `playlist.addPaths` | `paths: string[]`, `playlist?: integer >= 0` | Add file paths |
| `fb2k_playlist_add_handles` | `playlist.addHandles` | `handles: string[]`, `playlist?: integer >= 0` | Add track handles without CUE expansion |
| `fb2k_playlist_add_paths_sequential` | `playlist.addPathsSequential` | `paths: string[]`, `playlist?: integer >= 0` | Add paths sequentially |
| `fb2k_playlist_add_paths_async` | `playlist.addPathsAsync` | `paths: string[]`, `playlist?: integer >= 0` | Add paths asynchronously |
| `fb2k_playlist_replace_all_and_play` | `playlist.replaceAllAndPlay` | `paths: string[]`, `playlist?: integer >= 0`, `playIndex?: integer >= 0 = 0`, `stopFirst?: boolean = true`, `autoPlay?: boolean = true` | Atomically replace playlist contents and optionally play |

## Selection and focus

| Tool | Bridge method | Parameters | Description |
| --- | --- | --- | --- |
| `fb2k_playlist_get_selected_tracks` | `playlist.getSelectedTracks` | `playlist?: integer >= 0` | Get selected track details |
| `fb2k_playlist_get_selection` | `playlist.getSelection` | `playlist?: integer >= 0` | Get selected track indices |
| `fb2k_playlist_set_selection` | `playlist.setSelection` | `indices: integer[]`, `playlist?: integer >= 0`, `clearOthers?: boolean = true` | Set selected indices |
| `fb2k_playlist_select_all` | `playlist.selectAll` | `playlist?: integer >= 0` | Select every track |
| `fb2k_playlist_deselect_all` | `playlist.deselectAll` | `playlist?: integer >= 0` | Clear the selection |
| `fb2k_playlist_get_focused_track` | `playlist.getFocusedTrack` | `playlist?: integer >= 0` | Get the focused track index |
| `fb2k_playlist_set_focused_track` | `playlist.setFocusedTrack` | `index: integer >= 0`, `playlist?: integer >= 0` | Set the focused track |
| `fb2k_playlist_focus_track` | `playlist.focusTrack` | `playlist?: integer >= 0`, `index?: integer >= 0` | Deprecated compatibility tool; use `fb2k_playlist_set_focused_track` |
| `fb2k_playlist_get_focus_track` | `playlist.getFocusTrack` | `playlist?: integer >= 0` | Deprecated compatibility tool; use `fb2k_playlist_get_focused_track` |

## Undo, redo, and locking

| Tool | Bridge method | Parameters | Description |
| --- | --- | --- | --- |
| `fb2k_playlist_undo` | `playlist.undo` | `playlist?: integer >= 0` | Undo the last playlist operation |
| `fb2k_playlist_redo` | `playlist.redo` | `playlist?: integer >= 0` | Redo the last undone operation |
| `fb2k_playlist_get_lock_info` | `playlist.getLockInfo` | `playlist?: integer >= 0` | Get playlist lock information |
| `fb2k_playlist_is_locked` | `playlist.isLocked` | `playlist?: integer >= 0` | Check whether a playlist is locked |

## Autoplaylists

| Tool | Bridge method | Parameters | Description |
| --- | --- | --- | --- |
| `fb2k_playlist_is_autoplaylist` | `playlist.isAutoplaylist` | `playlist?: integer >= 0` | Check whether a playlist is an autoplaylist |
| `fb2k_playlist_create_autoplaylist` | `playlist.createAutoplaylist` | `query: string`, `name?: string = "New Autoplaylist"`, `sort?: string`, `keepSorted?: boolean = false` | Create an autoplaylist from a foobar2000 query |
| `fb2k_playlist_convert_to_autoplaylist` | `playlist.convertToAutoplaylist` | `query: string`, `playlist?: integer >= 0`, `sort?: string`, `keepSorted?: boolean = false` | Convert a playlist to an autoplaylist |
| `fb2k_playlist_remove_autoplaylist` | `playlist.removeAutoplaylist` | `playlist?: integer >= 0` | Remove autoplaylist behavior while preserving tracks |
| `fb2k_playlist_get_autoplaylist_info` | `playlist.getAutoplaylistInfo` | `playlist?: integer >= 0` | Get autoplaylist details |
| `fb2k_playlist_get_autoplaylist_query` | `playlist.getAutoplaylistQuery` | `playlist?: integer >= 0` | Get the autoplaylist query |

::: tip Query syntax
Autoplaylist queries use the same foobar2000 query language as `library.search`, for example `artist IS Mili`.
:::
