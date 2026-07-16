# foo_ui_webview2 Demo - 开发指南

## 🚀 开发模式（推荐）

### 为什么使用开发模式？

- ✅ **热更新**：修改代码后自动刷新，无需手动构建
- ✅ **快速反馈**：立即看到修改效果
- ✅ **源码调试**：支持 Source Map，方便调试
- ✅ **节省时间**：无需每次都运行 `npm run build`

### 启动开发模式

```bash
npm run dev
```

Vite 会在 `http://localhost:5173` 启动开发服务器。

### ⚠️ 重要：在 foobar2000 中运行

由于 foo_ui_webview2 需要在 foobar2000 环境中运行，开发模式有两种方式：

#### 方式一：直接在 fb2k 中加载源码（需要配置）

1. 修改 foobar2000 前端路径为源码目录：
   ```
   Preferences → Advanced → Tools → WebView UI → Frontend Path
   设置为: E:\Microsoft Visual Studio\foo_window\foo_ui_webview2\web\demo\index.html
   ```

2. Vite 开发服务器会自动处理热更新

#### 方式二：使用构建预览（推荐用于测试）

```bash
# 1. 启动开发服务器（在一个终端）
npm run dev

# 2. 构建并部署（在另一个终端）
npm run build && npm run deploy

# 3. 重启 foobar2000
```

---

## 📝 开发工作流

### 推荐工作流程

```
┌─────────────────┐
│  修改代码       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  保存文件       │ Ctrl+S
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  小改动     │   │  样式调整   │   │  大改动     │
│  组件修改   │   │  CSS 修改   │   │  新功能     │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│热更新生效   │   │热更新生效   │   │手动构建测试 │
│(无需操作)   │   │(无需操作)   │   │             │
└─────────────┘   └─────────────┘   └──────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │npm run build│
                                  │  + deploy   │
                                  └─────────────┘
```

### 具体步骤

#### 1. 小改动（组件、样式、逻辑）

```bash
# 只需启动开发服务器
npm run dev
```

修改后保存，Vite 会自动热更新到浏览器。

**注意**：如果是在 foobar2000 中运行，可能需要手动刷新窗口。

#### 2. 中等改动（新增组件、修改配置）

```bash
# 1. 开发
npm run dev

# 2. 测试前构建
npm run build

# 3. 部署
npm run deploy

# 4. 重启 foobar2000
```

#### 3. 大改动（重构、新功能）

```bash
# 完整流程
npm run build    # 构建
npm run deploy   # 部署
# 重启 foobar2000 并测试
```

---

## 🔧 自动化选项

### 添加 watch 模式（自动构建）

创建 `package.json` 脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "watch": "vite build --watch",
    "deploy": "powershell -ExecutionPolicy Bypass -File deploy.ps1"
  }
}
```

使用：

```bash
# 终端 1: 监听文件变化并自动构建
npm run watch

# 终端 2: 自动部署
npm run deploy
```

### 使用 nodemon 自动部署

安装依赖：

```bash
npm install -D nodemon
```

创建 `nodemon.json`：

```json
{
  "watch": [
    "src"
  ],
  "ext": "vue,ts,js,css",
  "ignore": [
    "dist",
    "node_modules"
  ],
  "exec": "npm run build && npm run deploy"
}
```

添加脚本：

```json
{
  "scripts": {
    "dev:watch": "nodemon"
  }
}
```

使用：

```bash
npm run dev:watch
```

这样每次保存文件都会自动构建并部署！

---

## 🐛 调试技巧

### 1. 开启 DevTools

在 foobar2000 高级设置中：
- `Preferences` → `Advanced` → `Tools` → `WebView UI` → `Enable DevTools`
- 按 `F12` 打开

### 2. 查看控制台日志

```typescript
// 在代码中添加日志
console.log('当前曲目:', track);
console.error('错误:', error);
```

### 3. 使用 Vue DevTools

安装 Vue DevTools 浏览器扩展（需要独立浏览器测试）。

### 4. 监听 API 调用

在控制台执行：

```javascript
// 监听所有 fb2k API 调用
const originalInvoke = window.fb2k.invoke;
window.fb2k.invoke = async (method, params) => {
  console.log(`[API→] ${method}`, params);
  const result = await originalInvoke(method, params);
  console.log(`[API←] ${method}`, result);
  return result;
};

// 监听所有事件
const originalOn = window.fb2k.on;
window.fb2k.on = (event, callback) => {
  return originalOn(event, (...args) => {
    console.log(`[EVENT] ${event}`, args);
    return callback(...args);
  });
};
```

---

## 📊 性能测试

### 构建时间分析

```bash
# 测量构建时间
time npm run build
```

### 构建产物大小分析

```bash
# 分析产物大小
npm run build
du -sh dist/*
```

### 安装 bundle 分析器

```bash
npm install -D rollup-plugin-visualizer
```

修改 `vite.config.ts`：

```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ open: true, gzipSize: true })
  ]
});
```

---

## ✅ 测试清单

每次修改后，测试以下功能：

### 基础功能
- [ ] 页面正常加载，无控制台错误
- [ ] 标题栏拖拽正常
- [ ] 窗口控制按钮正常（最小化/最大化/关闭）

### 播放功能
- [ ] 播放/暂停切换正常
- [ ] 上一首/下一首切换正常
- [ ] 进度条拖动定位准确
- [ ] 音量调节正常

### 数据显示
- [ ] 封面显示正常
- [ ] 曲目信息显示正确
- [ ] 播放列表加载正常
- [ ] 媒体库浏览正常

### 事件响应
- [ ] 曲目切换时封面更新
- [ ] 播放状态实时更新
- [ ] 进度条实时更新

---

## 🎯 最佳实践

### 1. 开发习惯

✅ **推荐**：
- 先在开发模式测试基本功能
- 确认无误后再构建部署
- 使用 Git 管理代码版本

❌ **避免**：
- 频繁手动构建
- 在未测试前部署
- 直接修改 dist 目录中的文件

### 2. 保存习惯

```typescript
// 修改代码后
Ctrl+S  // 保存
// ↓
// 等待热更新（开发模式）或手动构建
// ↓
// 在 foobar2000 中测试
```

### 3. 调试流程

```
发现问题
  ↓
打开 DevTools (F12)
  ↓
查看控制台错误
  ↓
定位代码位置
  ↓
修复问题
  ↓
保存并重新测试
```

---

## 💡 快捷键

| 操作 | 快捷键 |
|------|--------|
| 保存文件 | `Ctrl + S` |
| 打开 DevTools | `F12` |
| 刷新页面 | `Ctrl + R` |
| 强制刷新 | `Ctrl + Shift + R` |
| 切换终端 | `Ctrl + ` ` (反引号) |

---

## 📚 相关文档

- [Vite 开发服务器文档](https://vitejs.dev/guide/features.html#dev-server)
- [Vue 3 热更新](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [项目 README](./README.md)

---

## 🆘 常见问题

### Q: 热更新不工作？

**A**: 检查以下几点：
1. 开发服务器是否正在运行：`npm run dev`
2. 是否在 foobar2000 中加载（可能需要手动刷新）
3. 防火墙是否阻止了端口 5173

### Q: 构建失败？

**A**: 检查 TypeScript 错误：
```bash
# 只检查类型，不构建
npm run build -- --mode development
```

### Q: 修改后看不到效果？

**A**:
1. 检查是否保存了文件
2. 清除浏览器缓存：`Ctrl + Shift + R`
3. 重新构建：`npm run build && npm run deploy`

---

**记住**：开发模式是为了提高效率，但最终测试一定要在构建后的 foobar2000 环境中进行！
