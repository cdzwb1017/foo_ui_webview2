# foo_ui_webview2 Demo - 构建说明

本目录包含构建后的产物文件。

## 目录结构

```
dist/
├── index.html              # 入口 HTML
└── assets/
    ├── main.js            # 主 JavaScript 文件
    ├── main.css           # 样式文件
    └── [其他资源文件]
```

## 部署说明

### 方法一：手动部署

1. 将 `dist/` 目录中的所有文件复制到：
   ```
   <foobar2000安装目录>/configuration/foo_ui_webview2/frontend/
   ```

2. 重启 foobar2000

3. 在 foobar2000 偏好设置中设置前端路径：
   - `Preferences` → `Advanced` → `Tools` → `WebView UI` → `Frontend Path`
   - 设置为: `configuration\foo_ui_webview2\frontend\index.html`

### 方法二：使用构建脚本（推荐）

在项目根目录执行：
```bash
npm run build
```

构建完成后，使用以下 PowerShell 脚本自动部署：
```powershell
# deploy.ps1
$fb2kPath = "C:\Program Files\foobar2000"  # 修改为你的 foobar2000 安装路径
$targetPath = Join-Path $fb2kPath "configuration\foo_ui_webview2\frontend"

# 创建目标目录
New-Item -ItemType Directory -Force -Path $targetPath | Out-Null

# 复制文件
Copy-Item -Path "dist\*" -Destination $targetPath -Recurse -Force

Write-Host "部署完成！请重启 foobar2000。" -ForegroundColor Green
```

## 清理构建产物

```bash
# 手动删除
rm -rf dist/

# 或使用 rimraf
npm install -g rimraf
rimraf dist
```

## 注意事项

1. **路径分隔符**：Windows 使用反斜杠 `\`，配置文件中使用正斜杠 `/`
2. **绝对路径 vs 相对路径**：
   - 开发时使用相对路径：`base: './'`
   - 部署时 foobar2000 需要相对于安装目录的路径
3. **资源加载**：确保所有资源（图片、字体等）都使用相对路径

## 故障排查

### 问题：页面空白

**解决方案**：
1. 检查浏览器控制台（F12）是否有错误
2. 确认所有资源文件都已复制
3. 检查文件路径是否正确

### 问题：样式未加载

**解决方案**：
1. 确认 `assets/main.css` 存在
2. 检查 `index.html` 中的 CSS 引用路径

### 问题：API 调用失败

**解决方案**：
1. 确认 foo_ui_webview2 插件已安装
2. 检查浏览器控制台是否有 fb2k 对象
3. 确认在 foobar2000 中运行，而非独立浏览器

## 构建优化

### 分析构建产物大小

```bash
npm install -g rollup-plugin-visualizer
```

然后在 `vite.config.ts` 中添加：
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ open: true })
  ]
});
```

### 压缩构建产物

```bash
npm run build
```

Vite 默认会：
- 压缩 JavaScript
- 压缩 CSS
- 优化静态资源

## 版本信息

- 构建时间: {{构建时间}}
- Node 版本: {{Node 版本}}
- Vite 版本: {{Vite 版本}}
