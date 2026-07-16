# 更新日志

## v1.10.0 (2026-07-16)

- 新增：`TrayMenuItem.orientation`（仅 `type:'slider'`，`'horizontal' | 'vertical'`，默认水平）。仅精确 `vertical` 为纵向（min 底 / max 顶；Up/Right 增、Down/Left 减、Home/End 边界）；`native` 忽略并保持分级子菜单；旧 runtime 忽略未知字段保持水平。范围规范化：`max<min` 交换、`max==min` 常量不发 value、初始 value clamp、IPC 越界拒绝。`getMenuItems` round-trip。需要纵向时先 `config.getVersionInfo().plugin.version` 探测（最低版本未最终确认前不要写死假版本）
- 变更：自绘菜单两态焦点（导航 roving tabindex + 真实 focus / 富控件编辑态）与 ARIA（`menuitem` / `menuitemcheckbox` / 内部 `role=slider` / segmented `radiogroup`）；`checked:false` 仍为 checkable；默认入退场在 `prefers-reduced-motion: reduce` 下禁用 transform/transition（不改 hide protocol / `closeAnimationMs`）
- 新增：`TrayMenuConfig.layoutMode`（`'flat' | 'zones'`）。默认 `'flat'` 保留 `#menu > .fb-item` 直接子 DOM；显式 `'zones'` 时为非空 top / playback / bottom 生成 `.fb-zone[data-zone]`。`native` 忽略；旧 runtime 忽略未知字段但不生成 wrapper；`menu.show` 不受影响。需要 zones 的主题应先用 `config.getVersionInfo().plugin.version` 探测（最低版本号未最终确认前不要写死假版本）
- 变更：自绘菜单受保护 CSS 不再强制可见态 `#menu { display:block !important }`；主题可直接把根菜单 / zone 设为 flex 或 grid，但无法用 `display:* !important` 重新显示已隐藏菜单
- 安全：自绘菜单 SVG 图标改为 DOMParser + 元素/属性白名单克隆，移除 raw `innerHTML` 注入；非法或超限单图标被丢弃，菜单继续显示；`transform` 严格解析（拒绝前缀/函数间杂质与空参），节点必须位于 SVG namespace
- 安全：`tray.setContextMenu` / `tray.appendMenuItems` / `menu.show` 在写入持久配置或打开 overlay 前做资源上限事务性校验（item ≤ 512、`menu.show` 深度 ≤ 8、segmented options ≤ 64、CSS ≤ 256 KiB、SVG 总量 ≤ 256 KiB）；单图 SVG > 32 KiB 仅丢弃该图标。超限返回 `INVALID_PARAMS` 且 `details` 含 `field` / `limit` / `actual`；非法 / 超限输入属有意不兼容
- 安全加固：托盘 / 自绘菜单的内置动作改按可信内部来源路由，不再凭 public id 前缀。唯一兼容例外是 tray API 中精确、大小写敏感的 `_sys_exit`（保持 1.9.0 的真实退出行为）；调用方提供的 `_pb_playPause` / `_pb_prev` / `_pb_next` / `_pb_stop` 仍是普通用户项，且不能通过同名去重抑制 runtime 自动注入的 trusted 播放项；重复 public ID 由 opaque token 区分，公共 `menu.show` 不提权。每次选择 / 值变更由不可预测的单次 token 承载并按本次菜单索引校验，未知 / 过期 token、禁用项、越界富值（rating / slider / segmented）一律拒绝。内部 `menu.__*` IPC 另校验调用方是否为 overlay 自身窗口，且 select / dismiss / ready / submenuPanel / valueChanged 须匹配当前菜单 id；外部调用方或过期 / 伪造的 menuId 一律拒绝且不改变菜单状态
- 自绘 tray `ContentSized` 现在在字体就绪后离屏测量 root 与全部一级 submenu，并等待连续两帧尺寸稳定；C++ 使用 64 位安全槽位分配。固定 HWND 的 region 只覆盖当前可见 root/submenu panel，因此未展开预留区不再形成空白 acrylic/mica 面板，且调用方配置的 backdrop 不会被静默关闭
- 托盘自绘菜单 `segmented` 分段控件的值变更明确纳入“保持菜单打开”契约：一次分段切换经 `tray:menuItemClicked` 回传 `{ id, value }`（`value` = 被选中分段的从 0 起索引）且**不关闭**菜单，与 `rating` / `slider` 一致。`webview` 运行时一直保持菜单打开，本次仅修正此前只列 `rating` / `slider` 的共享契约与事件文档
- 托盘菜单全隐藏（或空）的分区不再产生多余 separator：此前分区内所有项 `visible:false` 时，隐藏项被过滤后会残留一条首/尾分隔线；现在可见性过滤先于 separator 判定，native 与 webview 菜单均不再出现该多余分隔线（默认行为修正）
- 文档修正：`TrayMenuItem.icon`（base64 ICO）为保留字段，当前两种后端均不渲染（`native` 纯文本、webview 绘制 `iconSvg`）；菜单项图标请改用 `iconSvg`

## v1.9.0 (2026-06-18)

- 托盘自绘菜单（`render: 'webview'`）普通/子菜单项支持图标：新增 `TrayMenuItem.iconSvg = { viewBox, content }`，内联单色 SVG、`currentColor` 跟随菜单文字色、左对齐固定 8px 间距；同层有图标时所有普通/子菜单项预留 16px 图标列以对齐文字（`native` 菜单忽略）
- `tray.setContextMenu` 新增 `config.autoNowPlaying`：开启后 `nowplaying` 项的空字段（cover/title/subtitle）在右键弹出时由后端用当前曲目自动兜底（前端传了就用前端值，**前端优先**）；`cover` 兜底仅 `webview`，取当前曲目封面并缩略为缩略图，title/subtitle 走 `%title%`（自动回退文件名）/`%artist%`，兼容流媒体动态标题
- `TrayMenuItem.cover` 现额外支持 `http(s)://` URL（除既有 `data:` 与裸 base64 外），便于流媒体前端直传实时解析的封面
- SDK 安装包同步到 `1.9.0`

## v1.8.0 (2026-06-10)

- 新增自绘菜单能力：`menu.show` / `menu.close` 以 WebView 渲染菜单内容，支持子菜单递归渲染；菜单窗口采用内容尺寸固定窗策略，消除展开时的闪烁
- `tray.*` 新增 `render: 'webview'` 模式，托盘右键菜单可改用自绘菜单渲染，外观与主题保持统一
- 新增 `tray.setMenuItemState`，可在不重建整个菜单的情况下更新单个菜单项状态
- 修复桌面歌词等置顶弹窗点击后，主窗口偶发被拉至前台并意外置顶的问题（撤销路径 z-order 插入误入 topmost 段 + sink 还原参照反馈环）
- 修复 SDK 发布物缺失 `HTMLElementTagNameMap` 全局声明的问题，npm 用户恢复 `fb-*` 自定义元素的类型提示
- 修复打包脚本在新版 PowerShell 下无法生成 `.fb2k-component` 的兼容性问题
- HttpApi 异步请求异常边界加固；修复 LibraryApi 一处 NUL 字符串处理缺陷
- SDK 安装包同步到 `1.8.0`；`bump-version.ps1` 版本同步覆盖面扩展到 `sdk/package-lock.json` 与 VitePress 导航栏版本号

## v1.7.0 (2026-06-06)

- 新增 Taskbar & Tray 能力：`taskbar.*` 可设置任务栏缩略图按钮、进度条、叠加图标和闪烁提示；`tray.*` 可创建系统托盘图标、气泡通知和右键菜单
- `tray.*` 新增增量菜单管理：`appendMenuItems` / `removeMenuItems` / `clearMenuItems` / `getMenuItems`，可以按 `top` / `playback` / `bottom` 分区动态维护托盘菜单，不必每次重建完整菜单
- 新增 `taskbar:buttonClicked`、`tray:click`、`tray:doubleClick`、`tray:menuItemClicked`、`tray:beforeContextMenu` 事件，主题可以响应任务栏缩略图按钮和托盘交互
- 新增 `webview:processFailed` 事件，WebView2 渲染进程异常时会广播诊断信息，并配合渲染进程自动恢复路径降低空白窗口风险
- 新增高精度播放位置事件 `playback:timeHighRes`，由独立 WinAPI 定时器驱动，适合歌词、进度条等需要亚秒级刷新的界面
- `library.getAll` 冷缓存全量序列化改为后台线程执行；SDK 会等待 `library:getAllResult` 并按 `requestId` 关联结果，避免大媒体库查询卡住 UI
- 修复托盘隐藏后窗口恢复路径，补全 `window.focus` / hidden restore 场景下的 WebView surface 恢复，降低最小化、托盘隐藏、Alt+Tab 切回后的空白风险
- 修复任务栏缩略图 pause 图标 base64 损坏和 HICON 所有权问题，避免播放按钮显示异常和 explorer.exe 崩溃
- SDK 安装包同步到 `1.7.0`，可直接使用新的 Taskbar & Tray 类型和事件声明
- VitePress 文档新增 Taskbar & Tray API 页面，并同步 Cursor、Playback 高频事件和相关示例

## v1.6.1 (2026-05-20)

- 新增 `cursor.*` 命名空间：`cursor.setHidden(hidden)` / `cursor.isHidden()` 显式控制客户区光标可见性；解决 Visual Hosting 模式下 CSS `cursor: none` 不可靠的问题
- 新增 `cursor:hiddenChanged` 事件，每窗口独立派发
- `fb.http.*` 新增 `insecureTls` 参数（双层门禁）— 全局开关 `Allow self-signed / invalid TLS certificates` ON + 每请求 `insecureTls: true` 才生效，访问自签证书的内网服务（Plex / Jellyfin / Lidarr 等）不再被强制拦截
- `fb.http.*` 新增 `responseType: 'arraybuffer' | 'binary'`，body 自动 base64 解码为 `ArrayBuffer`，封面 / 字体等二进制资源不再因 UTF-8 严格校验失败
- VitePress 文档同步上述变化（cursor.md / http.md / events.md）

## v1.6.0 (2026-05-11)

- `playlist.getAll` 不再返回 `duration` 字段，避免为了时长把整批轨道都读一遍；`playlist.getActive` / `playlist.getPlaying` 还是会返回
- `http.get` / `http.post` / `http.head` 默认改成异步；如果你就是要同步调用，需要显式传 `async: false`

## v1.1.17 (2026-02-06) 

- 可以真正开多个窗口了
- 新增 `window.createPopup` / `closePopup` / `closeAllPopups` / `getAllWindows`
- 新增 `window.sendMessage` / `window.broadcast`，窗口之间可以互相发消息
- 支持异步关闭、无标题栏和透明背景

## v1.1.16 (2026-02-06)
