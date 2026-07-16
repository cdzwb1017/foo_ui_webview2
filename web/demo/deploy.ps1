param(
    [string]$Fb2kPath = "C:\Program Files\foobar2000"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " foo_ui_webview2 Demo 部署脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 dist 目录是否存在
if (-not (Test-Path "dist")) {
    Write-Host "❌ 错误: dist 目录不存在，请先运行 'npm run build'" -ForegroundColor Red
    exit 1
}

# 检查 foobar2000 目录是否存在
if (-not (Test-Path $Fb2kPath)) {
    Write-Host "❌ 错误: foobar2000 目录不存在: $Fb2kPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "请使用正确的路径运行此脚本：" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1 -Fb2kPath 'D:\Program Files\foobar2000'" -ForegroundColor Yellow
    exit 1
}

$targetPath = Join-Path $Fb2kPath "configuration\foo_ui_webview2\frontend"

Write-Host "📦 foobar2000 路径: $Fb2kPath" -ForegroundColor Green
Write-Host "📁 目标路径: $targetPath" -ForegroundColor Green
Write-Host ""

# 创建目标目录
Write-Host "🔨 创建目标目录..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $targetPath | Out-Null

# 复制文件
Write-Host "📋 复制构建产物..." -ForegroundColor Yellow
Copy-Item -Path "dist\*" -Destination $targetPath -Recurse -Force

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor White
Write-Host "  1. 重启 foobar2000" -ForegroundColor Yellow
Write-Host "  2. 在偏好设置中设置前端路径：" -ForegroundColor Yellow
Write-Host "     Preferences → Advanced → Tools → WebView UI → Frontend Path" -ForegroundColor Gray
Write-Host "     设置为: configuration\foo_ui_webview2\frontend\index.html" -ForegroundColor Gray
Write-Host ""
