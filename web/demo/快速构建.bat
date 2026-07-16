@echo off
chcp 65001 >nul
echo 正在安装依赖...
npm install
echo.
echo 正在构建项目...
npm run build
echo.
echo 构建完成！
echo.
echo 按任意键部署到 foobar2000，或关闭窗口退出
pause >nul
if errorlevel 1 (
    npm run deploy
    echo.
    echo 部署完成！请重启 foobar2000 进行测试。
) else (
    echo 跳过部署。
)
pause
