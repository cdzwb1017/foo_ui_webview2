# foo_ui_webview2 Demo

> 一个功能完整的示例 Demo，展示如何使用 foo_ui_webview2 插件构建现代音乐播放器界面

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全
- **Pinia** - 状态管理
- **TailwindCSS** - 实用优先的 CSS 框架
- **Vite** - 下一代前端构建工具

## 功能特性

### ✅ 已实现功能

- [x] **自定义标题栏** - 支持拖拽、最小化、最大化、关闭
- [x] **播放控制** - 播放/暂停/停止/上一首/下一首
- [x] **进度控制** - 进度条显示和拖动定位
- [x] **音量控制** - 音量滑块、静音切换
- [x] **播放列表** - 显示列表、切换曲目、移除曲目
- [x] **媒体库** - 专辑浏览、搜索功能
- [x] **封面显示** - 当前曲目和专辑封面
- [x] **DWM 效果** - Windows 11 Mica 背景
- [x] **事件订阅** - 实时播放状态更新
- [x] **响应式设计** - 适配不同窗口大小

## 项目结构

```
web/demo/
├── index.html              # 入口 HTML
├── package.json            # 依赖配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── tailwind.config.js      # TailwindCSS 配置
├── deploy.ps1              # 自动部署脚本
├── .gitignore              # Git 忽略配置
├── dist/                   # 构建输出目录（构建后生成）
│   └── README.md           # 构建目录说明
└── src/
    ├── main.ts             # 应用入口
    ├── App.vue             # 根组件
    ├── api/
    │   ├── fb2k.ts         # fb2k Bridge 封装
    │   └── types.ts        # 类型定义
    ├── stores/
    │   ├── playback.ts     # 播放状态管理
    │   ├── playlist.ts     # 播放列表状态管理
    │   └── library.ts      # 媒体库状态管理
    ├── components/
    │   ├── TitleBar.vue    # 自定义标题栏
    │   ├── Player.vue      # 播放控制器
    │   ├── Playlist.vue    # 播放列表
    │   ├── Library.vue     # 媒体库浏览
    │   └── AlbumArt.vue    # 封面显示
    └── styles/
        └── main.css        # 全局样式
```

## 开发指南

### 安装依赖

```bash
cd web/demo
npm install
```

### 开发模式（推荐用于快速迭代）

详细的开发指南请参阅 [DEVELOPMENT.md](./DEVELOPMENT.md)

```bash
# 启动开发服务器（支持热更新）
npm run dev
```

**注意**：由于 foo_ui_webview2 需要在 foobar2000 环境中运行，开发模式有以下两种使用方式：

1. **源码模式**（需要配置）：
   - 在 foobar2000 偏好设置中设置前端路径为源码目录的 `index.html`
   - Vite 开发服务器会自动处理热更新

2. **构建测试模式**（推荐）：
   ```bash
   # 开发时使用
   npm run dev

   # 测试前构建并部署
   npm run build:deploy
   ```

### 快速测试流程

```bash
# 方法一：一键构建并部署（推荐）
npm run build:deploy

# 方法二：分步执行
npm run build
npm run deploy

# 方法三：类型检查
npm run type-check
```

### 监听模式（自动构建）

```bash
# 终端 1: 启动文件监听
npm run watch

# 文件修改后会自动重新构建到 dist/ 目录
# 然后手动运行部署命令
```

### 构建生产版本

```bash
# 完整构建（类型检查 + 构建）
npm run build

# 仅构建（跳过类型检查，更快）
npm run build:only
```

构建产物将输出到 `dist/` 目录。

### 部署到 foobar2000

#### 方法一：使用自动部署脚本（推荐）

```bash
# 一键构建并部署
npm run build:deploy

# 或者只部署（如果已构建）
npm run deploy

# 使用自定义路径
npm run deploy:custom "D:\Program Files\foobar2000"
```

#### 方法二：手动部署

1. 构建项目: `npm run build`
2. 将 `dist/` 目录内容复制到 foobar2000 配置目录:
   ```
   <foobar2000>/configuration/foo_ui_webview2/frontend/
   ```
3. 重启 foobar2000
4. 如果是首次使用，在 foobar2000 偏好设置中设置前端路径:
   - `Preferences` → `Advanced` → `Tools` → `WebView UI` → `Frontend Path`
   - 设置为: `configuration\foo_ui_webview2\frontend\index.html`

### dist 目录说明

`dist/` 目录包含构建后的产物文件，会在每次构建时自动清空并重新生成：

```
dist/
├── index.html              # 入口 HTML
└── assets/
    ├── main.js            # 主 JavaScript 文件
    ├── main.css           # 样式文件
    └── [其他资源文件]
```

**注意**：
- 此目录在 `.gitignore` 中，不会被提交到版本控制
- 每次构建前会自动清空
- 请勿手动修改此目录中的文件

详细信息请参阅 [dist/README.md](./dist/README.md)

## 核心实现说明

### 1. 路径处理最佳实践

```typescript
// ✅ 正确：始终使用 absolutePath
import { isStaticLocalFile } from '@/api/types';

if (isStaticLocalFile(track.absolutePath)) {
  const artwork = await invoke('artwork.getForTrack', {
    path: track.absolutePath,  // 使用 absolutePath
    type: 'front'
  });
}

// ❌ 错误：不要使用 path（可能是 file-relative:// 格式）
const artwork = await invoke('artwork.getForTrack', {
  path: track.path,  // 可能导致封面获取失败
  type: 'front'
});
```

### 2. 音量格式

```typescript
// ✅ 正确：音量范围是 0-100（百分比）
await invoke('playback.setVolume', { volume: 80 });  // 80%

// ❌ 错误：不要使用 0-1
await invoke('playback.setVolume', { volume: 0.8 });  // 错误！
```

### 3. 事件名称格式

```typescript
// ✅ 正确：使用冒号分隔
fb2k.on('playback:trackChanged', callback);
fb2k.on('playback:stateChanged', callback);

// ❌ 错误：不要使用点号
fb2k.on('playback.trackChanged', callback);  // 不支持！
```

### 4. DWM 效果设置

```typescript
// Windows 11 Mica 效果
await invoke('window.setBackdrop', { type: 'mica' });

// 其他选项: 'mica-alt' | 'acrylic' | 'none' | 'auto'
```

### 5. 拖拽区域设置

```vue
<!-- 使用 CSS 属性方式（推荐） -->
<div class="titlebar" data-webview-drag="true">
  <button data-webview-drag="false">按钮</button>
</div>

<script setup>
await invoke('window.setDragRegions', { mode: 'css' });
</script>
```

## 常见问题

### Q: 封面不显示？

**A**: 检查以下几点：
1. 是否使用了 `absolutePath` 而非 `path`？
2. 是否使用 `isStaticLocalFile()` 判断了文件类型？
3. 网络流和 CD 音轨无法获取封面

### Q: 事件不触发？

**A**: 确认事件名称格式：
- ✅ `playback:trackChanged`
- ❌ `playback.trackChanged` 或 `PlaybackTrackChanged`

### Q: 音量调节无效？

**A**: 检查音量值是否在 0-100 范围内：
- ✅ `volume: 80`
- ❌ `volume: 0.8`

### Q: 拖拽不工作？

**A**: 确保使用了正确的 API：
```typescript
// CSS 属性方式（推荐）
await invoke('window.setDragRegions', { mode: 'css' });

// 然后在 HTML 中标记
<div data-webview-drag="true">...</div>
```

## 调试技巧

### 开启 DevTools

1. 在 foobar2000 高级设置中:
   - `Preferences` → `Advanced` → `Tools` → `WebView UI` → `Enable DevTools`
2. 按 `F12` 打开开发者工具

### 监听所有 API 调用

```typescript
// 在控制台执行
const originalInvoke = window.fb2k.invoke;
window.fb2k.invoke = async (method, params) => {
  console.log(`[API] ${method}`, params);
  const result = await originalInvoke(method, params);
  console.log(`[API] ${method} →`, result);
  return result;
};
```

## 参考资源

- [API 文档](../../docs/vitepress/guide/overview.md) - 完整 API 文档（推荐）
- [Demo 开发指南](../../docs/DEMO_DEVELOPMENT_GUIDE.md) - 本 Demo 的详细开发指南
- [简单 Demo 指南](../../docs/SIMPLE_DEMO_GUIDE.md) - 无框架的简化版 Demo
- [项目规格](../../docs/PROJECT_SPEC.md) - 插件技术规格

## 验收清单

### 功能检查

- [x] 应用启动无报错
- [x] 播放/暂停/停止正常工作
- [x] 上一首/下一首正常切换
- [x] 进度条拖动定位准确
- [x] 音量调节和静音正常
- [x] 播放列表正确显示
- [x] 点击曲目可播放
- [x] 媒体库专辑正确加载
- [x] 封面图正确显示
- [x] DWM 效果正常（Windows 11）
- [x] 标题栏拖拽正常
- [x] 窗口控制按钮正常
- [x] 事件订阅/取消订阅正常
- [x] 无内存泄漏

### 代码质量

- [x] TypeScript 类型完整
- [x] 组件职责单一
- [x] 错误处理完善
- [x] 注释清晰，标注易错点
- [x] 响应式设计

## 许可证

MIT License

## 致谢

本项目基于 [foo_ui_webview2](../../) 插件开发，感谢原作者的贡献。
