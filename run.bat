@echo off
setlocal

:: Check MongoDB silently
sc query MongoDB | find "RUNNING" >nul 2>&1
if errorlevel 1 (
    net start MongoDB >nul 2>&1
)

:: Check if localhost:3000 is running
powershell -Command "try { Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1

if %errorlevel%==0 (
    start "" "http://localhost:3000"
    exit /b
)

:: Start npm dev server fully hidden
start /b cmd /c "npm start >nul 2>&1"

:: Give server time to boot
ping 127.0.0.1 -n 4 >nul

:: Open browser
start "" "http://localhost:3000"

exit /b
