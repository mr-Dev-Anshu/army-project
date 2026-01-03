@echo off
title Army Project Launcher Builder

echo ================================================
echo   ARMY PROJECT LAUNCHER BUILDER - WINDOWS
echo ================================================
echo.

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ? Python not found! Please install Python first.
    pause
    exit /b 1
)
echo ? Python found

echo.
echo Installing/updating required packages...
pip install --upgrade pyinstaller tkinter

echo.
echo Building launcher...
python build.py

echo.
echo Build process completed!
pause