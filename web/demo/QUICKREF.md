# foo_ui_webview2 Demo 快速参考

## 🚀 快速开始

```bash
# 首次使用
npm install
npm run build:deploy

# 日常开发
npm run dev              # 启动开发服务器
npm run build:deploy    # 构建并部署
```

---

## 📝 常用命令

### 开发相关

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器（热更新） |
| `npm run build` | 完整构建（类型检查 + 打包） |
| `npm run build:only` | 仅打包（跳过类型检查） |
| `npm run watch` | 监听文件变化自动构建 |
| `npm run type-check` | 仅检查类型 |
| `npm run preview` | 预览构建产物 |

### 部署相关

| 命令 | 说明 |
|------|------|
| `npm run deploy` | 部署到默认路径 |
| `npm run deploy:custom "路径"` | 部署到自定义路径 |
| `npm run build:deploy` | 构建并部署（一键） |

---

## 🎯 开发流程

### 方案一：快速迭代（推荐）

```
修改代码 → 保存 → npm run build:deploy → 测试
```

### 方案二：监听模式

```
终端1: npm run watch
终端2: npm run deploy
修改代码 → 自动构建 → 手动部署 → 测试
```

### 方案三：开发模式（需要配置）

```
1. 设置 foobar2000 前端路径为源码 index.html
2. npm run dev
3. 修改代码 → 自动热更新
```

---

## 🐛 调试技巧

### 开启 DevTools
```
foobar2000 偏好设置:
Preferences → Advanced → Tools → WebView UI → Enable DevTools
然后按 F12
```

### 监听 API 调用
```javascript
// 在控制台执行
const originalInvoke = window.fb2k.invoke;
window.fb2k.invoke = async (method, params) => {
  console.log(`[API→] ${method}`, params);
  const result = await originalInvoke(method, params);
  console.log(`[API←] ${method}`, result);
  return result;
};
```

---

## ✅ 测试清单

- [ ] 页面正常加载
- [ ] 标题栏拖拽正常
- [ ] 播放控制正常
- [ ] 封面显示正常
- [ ] 播放列表加载正常
- [ ] 媒体库浏览正常
- [ ] 事件订阅正常
- [ ] 无控制台错误

---

## 📁 重要路径

```
web/demo/
├── src/           # 源码目录
├── dist/          # 构建产物（部署到 foobar2000）
└── index.html     # 开发模式入口
```

---

## 💡 最佳实践

1. **小改动**：开发模式 + 手动刷新
2. **中等改动**：build + deploy + 测试
3. **大改动**：完整测试所有功能
4. **提交前**：`type-check` + `build`

---

## 🆘 遇到问题？

1. 查看控制台错误（F12）
2. 检查 TypeScript 类型：`npm run type-check`
3. 清理并重新构建：
   ```bash
   rm -rf dist node_modules
   npm install
   npm run build
   ```

详细文档请参阅：
- [README.md](./README.md) - 完整文档
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 开发指南
- [dist/README.md](./dist/README.md) - 构建说明
