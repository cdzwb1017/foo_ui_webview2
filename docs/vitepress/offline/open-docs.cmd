@echo off
setlocal
set "POWERSHELL=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
if not exist "%POWERSHELL%" (
  echo Windows PowerShell could not be found.
  echo This documentation package requires Windows 10 or Windows 11.
  pause
  exit /b 1
)
if not exist "%~dp0serve-docs.ps1" (
  echo serve-docs.ps1 is missing. Extract the complete ZIP and try again.
  pause
  exit /b 1
)
"%POWERSHELL%" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve-docs.ps1"
if errorlevel 1 pause
