@echo off
echo ========================================
echo  Starting Build
echo ========================================
echo.

cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo Running: npm run build
echo.
call npm run build

echo.
echo ========================================
if errorlevel 1 (
    echo ❌ Build FAILED
) else (
    echo ✅ Build SUCCESS
)
echo ========================================
echo.

echo Checking build output:
if exist "dist\index.html" (
    echo   ✅ dist\index.html found
) else (
    echo   ❌ dist\index.html NOT found
)

if exist "dist\assets" (
    echo   ✅ dist\assets directory found
) else (
    echo   ❌ dist\assets NOT found
)

echo.
pause
