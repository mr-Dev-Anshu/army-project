#!/bin/bash

# Army Project Launcher Builder - Linux/macOS
echo "================================================"
echo "   ARMY PROJECT LAUNCHER BUILDER - UNIX/LINUX"
echo "================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found! Please install Python3 first."
    echo "   Ubuntu/Debian: sudo apt install python3 python3-pip python3-tk"
    echo "   macOS: brew install python-tk"
    exit 1
fi
echo "✅ Python3 found"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 not found! Please install pip3 first."
    exit 1
fi
echo "✅ pip3 found"

echo ""
echo "Installing/updating required packages..."
pip3 install --upgrade pyinstaller

echo ""
echo "Building launcher..."
python3 build_linux.py

echo ""
echo "Build process completed!"
echo "Press Enter to continue..."
read