# Titleformat & ReplayGain

通用标题格式化与 ReplayGain 交叉参考。主 owner 页面：

- [Titleformat API](/zh/api/titleformat)
- [Audio / ReplayGain API](/zh/api/audio)

## titleformat.eval

评估单个文件的单个 titleformat 表达式。

运行时权威：`src/api/TitleformatApi.cpp`（`titleformat.eval`）。

## titleformat.evalBatch

批量评估多个文件的同一表达式。

运行时权威：`src/api/TitleformatApi.cpp`（`titleformat.evalBatch`）。

## titleformat.evalFields

评估单个文件的多个字段（推荐）。

运行时权威：`src/api/TitleformatApi.cpp`（`titleformat.evalFields`）。

## titleformat.evalFieldsBatch

批量评估多个文件的多个字段（适合自定义列表列）。

运行时权威：`src/api/TitleformatApi.cpp`（`titleformat.evalFieldsBatch`）。

## titleformat.getBuiltinFields

获取内置字段参考。

**用途场景**:

- 自定义列表列（播放次数、评分、添加日期等）
- 条件显示（如 `$if(%album%,%album%,Unknown)`）
- 获取 foo_playcount 数据（`%play_count%`, `%rating%`, `%last_played%`）

运行时权威：`src/api/TitleformatApi.cpp`（`titleformat.getBuiltinFields`）。

## replaygain.get

获取文件的 ReplayGain 信息（`trackGain`, `trackPeak`, `albumGain`, `albumPeak` 及 handler 返回的状态字段）。

运行时权威：`src/api/ReplayGainApi.cpp`（`replaygain.get`）。

## replaygain.scan

触发 ReplayGain 扫描（通过 handler 暴露的上下文菜单工作流）。

运行时权威：`src/api/ReplayGainApi.cpp`（`replaygain.scan`）。

## replaygain.clear

清除文件的 ReplayGain 信息。

运行时权威：`src/api/ReplayGainApi.cpp`（`replaygain.clear`）。

## 相关配置 API

模式/前置增益相关接口见 Audio owner 页：

- `replaygain.getMode`
- `replaygain.setMode`
- `replaygain.getPreamp`
- `replaygain.setPreamp`
- `replaygain.getSettings`
