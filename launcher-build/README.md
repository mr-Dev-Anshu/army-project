# Army Project Launcher Builder

A cross-platform launcher builder for the Army Project Next.js application.

## 📁 Files

- `launcher.py` - Main launcher application with GUI
- `build.py` - Windows build script (Python)
- `build_linux.py` - Linux/macOS build script (Python)
- `build.bat` - Windows build script (batch)
- `build.sh` - Linux/macOS build script (shell)

## 🚀 Building

### Windows
```bash
# Run the batch file
build.bat

# Or manually:
pip install pyinstaller
python build.py
```

### Linux/macOS
```bash
# Make script executable and run
chmod +x build.sh
./build.sh

# Or manually:
pip3 install pyinstaller
python3 build_linux.py
```

## 📋 Requirements

- Python 3.7+
- tkinter (usually included with Python)
- PyInstaller (auto-installed by build scripts)

## 🎯 Output

The build process creates a standalone executable:
- **Windows**: `ArmyProjectLauncher.exe`
- **Linux**: `ArmyProjectLauncher_linux`
- **macOS**: `ArmyProjectLauncher_macOS`

## ✨ Features

- **Cross-platform** - Works on Windows, Linux, and macOS
- **Auto-elevation** - Requests admin/sudo privileges automatically
- **MongoDB management** - Starts MongoDB service if available
- **Modern GUI** - Clean dark theme with progress indicators
- **Terminal-like behavior** - Close window to stop server
- **Auto browser opening** - Opens localhost:3000 automatically

## 📖 Usage

1. Copy the built executable to your Next.js project folder (where `package.json` is located)
2. Double-click to run the launcher
3. The launcher will:
   - Request admin privileges (Windows) or sudo (Linux/macOS)
   - Start MongoDB service if available
   - Launch your Next.js development server
   - Open your browser to http://localhost:3000
4. Close the launcher window to stop the server

## 🔧 Troubleshooting

- **"Python not found"**: Install Python from python.org
- **"package.json not found"**: Place the executable in your project root folder
- **MongoDB errors**: Install MongoDB or ignore if not needed
- **Permission errors**: Run as administrator (Windows) or with sudo (Linux/macOS)