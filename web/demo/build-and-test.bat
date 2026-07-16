@echo off
setlocal enabledelayedexpansion

echo ========================================
echo foo_ui_webview2 Demo 自动构建脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查工作目录...
echo 当前目录: %CD%
if not exist "package.json" (
    echo ❌ 错误: 未找到 package.json
    pause
    exit /b 1
)
echo ✅ package.json 已找到
echo.

echo [2/3] 安装依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install 失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装，跳过
)
echo.

echo [3/3] 执行构建...
echo 正在构建项目...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo.

echo ========================================
echo ✅ 构建成功！
echo ========================================
echo.
echo 构建产物位置: %CD%\dist\
echo.
echo 下一步操作:
echo   1. 运行 npm run deploy 部署到 foobar2000
echo   2. 或手动复制 dist\* 到 foobar2000 配置目录
echo.
pause
