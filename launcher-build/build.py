import PyInstaller.__main__
import os
import shutil
import sys

def build_launcher():
    print("Building Army Project Launcher...")
    
    # Clean previous builds
    if os.path.exists('dist'):
        shutil.rmtree('dist')
    if os.path.exists('build'):
        shutil.rmtree('build')
    
    # Build the executable
    PyInstaller.__main__.run([
        'launcher.py',
        '--onefile',
        '--windowed',
        '--name=ArmyProjectLauncher',
        '--distpath=../.',
        '--clean',
        '--add-data=launcher.py;.',
        '--icon=NONE'
    ])
    
    # Check if build was successful
    launcher_exe = '../ArmyProjectLauncher.exe'
    if os.path.exists(launcher_exe):
        print("\n✅ SUCCESS! Launcher built successfully!")
        print(f"📁 Location: {os.path.abspath(launcher_exe)}")
        print("📏 File size: {:.2f} MB".format(os.path.getsize(launcher_exe) / (1024 * 1024)))
        print("\n🚀 Usage:")
        print("1. Copy ArmyProjectLauncher.exe to your project folder (where package.json is)")
        print("2. Double-click to run - it will automatically:")
        print("   - Request admin privileges")
        print("   - Start MongoDB service")
        print("   - Launch your Next.js server")
        print("   - Open browser")
        print("3. Close the window to stop the server")
        
        # Clean up build files
        if os.path.exists('build'):
            shutil.rmtree('build')
        if os.path.exists('ArmyProjectLauncher.spec'):
            os.remove('ArmyProjectLauncher.spec')
        if os.path.exists('dist'):
            shutil.rmtree('dist')
    else:
        print("\n❌ Build failed!")
        print("Make sure you have PyInstaller installed: pip install pyinstaller")

if __name__ == "__main__":
    build_launcher()