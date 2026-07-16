# foo_ui_webview2 Demo 自动构建脚本

$ErrorActionPreference = "Stop"

# 获取脚本所在目录
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " foo_ui_webview2 Demo 自动构建脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 工作目录: $PWD" -ForegroundColor Green
Write-Host ""

# 检查 package.json
if (-not (Test-Path "package.json")) {
    Write-Host "❌ 错误: 未找到 package.json" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "✅ package.json 已找到" -ForegroundColor Green
Write-Host ""

# 检查依赖
Write-Host "📦 [1/3] 检查依赖..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   正在安装依赖（这可能需要几分钟）..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ 依赖安装完成" -ForegroundColor Green
    } else {
        Write-Host "   ❌ 依赖安装失败" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
} else {
    Write-Host "   ✅ 依赖已存在，跳过安装" -ForegroundColor Green
}
Write-Host ""

# 执行构建
Write-Host "🔨 [2/3] 执行构建..." -ForegroundColor Yellow
Write-Host "   正在构建项目（类型检查 + 打包）..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ 构建完成" -ForegroundColor Green
} else {
    Write-Host "   ❌ 构建失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host ""

# 验证构建产物
Write-Host "✔️  [3/3] 验证构建产物..." -ForegroundColor Yellow
$hasErrors = $false

if (-not (Test-Path "dist\index.html")) {
    Write-Host "   ❌ index.html 未找到" -ForegroundColor Red
    $hasErrors = $true
} else {
    Write-Host "   ✅ index.html 已生成" -ForegroundColor Green
}

if (-not (Test-Path "dist\assets")) {
    Write-Host "   ❌ assets 目录未找到" -ForegroundColor Red
    $hasErrors = $true
} else {
    $assetCount = (Get-ChildItem "dist\assets" -File).Count
    Write-Host "   ✅ assets 目录已生成 ($assetCount 个文件)" -ForegroundColor Green
}

if ($hasErrors) {
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""

# 显示构建结果
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " ✅ 构建成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 构建产物位置: $PWD\dist\" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 下一步操作:" -ForegroundColor Yellow
Write-Host "   运行以下命令部署到 foobar2000:" -ForegroundColor White
Write-Host "   npm run deploy" -ForegroundColor Gray
Write-Host ""

Read-Host "按回车键退出"
