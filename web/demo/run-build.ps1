$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " 开始构建" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "E:\Microsoft Visual Studio\foo_window\foo_ui_webview2\web\demo"

Write-Host "运行: npm run build" -ForegroundColor Yellow
Write-Host ""

npm run build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 构建成功！" -ForegroundColor Green
} else {
    Write-Host "❌ 构建失败" -ForegroundColor Red
}
Write-Host "========================================" -ForegroundColor Cyan

# 检查构建产物
Write-Host ""
Write-Host "检查构建产物:" -ForegroundColor Yellow
if (Test-Path "dist\index.html") {
    Write-Host "  ✅ dist\index.html" -ForegroundColor Green
} else {
    Write-Host "  ❌ dist\index.html 未找到" -ForegroundColor Red
}

if (Test-Path "dist\assets") {
    $assetCount = (Get-ChildItem "dist\assets" -File).Count
    Write-Host "  ✅ dist\assets ($assetCount 个文件)" -ForegroundColor Green
} else {
    Write-Host "  ❌ dist\assets 未找到" -ForegroundColor Red
}

Write-Host ""
Read-Host "按回车键退出"
