import PyInstaller.__main__
import os
import shutil
import sys

def build_launcher():
    print("Building Army Project Launcher for Linux/macOS...")
    
    # Clean previous builds
    if os.path.exists('dist'):
        shutil.rmtree('dist')
    if os.path.exists('build'):
        shutil.rmtree('build')
    
    # Determine the output name based on platform
    if sys.platform.startswith('darwin'):
        output_name = 'ArmyProjectLauncher_macOS'
    else:
        output_name = 'ArmyProjectLauncher_linux'
    
    # Build the executable
    PyInstaller.__main__.run([
        'launcher.py',
        '--onefile',
        '--windowed' if sys.platform.startswith('darwin') else '--console',
        f'--name={output_name}',
        '--distpath=../.',
        '--clean',
        '--add-data=launcher.py:.'
    ])
    
    # Check if build was successful
    launcher_exe = f'../{output_name}'
    if os.path.exists(launcher_exe):
        # Make executable on Unix systems
        os.chmod(launcher_exe, 0o755)
        
        print("\n✅ SUCCESS! Launcher built successfully!")
        print(f"📁 Location: {os.path.abspath(launcher_exe)}")
        print("📏 File size: {:.2f} MB".format(os.path.getsize(launcher_exe) / (1024 * 1024)))
        print("\n🚀 Usage:")
        print(f"1. Copy {output_name} to your project folder (where package.json is)")
        print("2. Run the executable - it will automatically:")
        if not sys.platform.startswith('darwin'):
            print("   - Request sudo privileges (for MongoDB)")
        print("   - Start MongoDB service")
        print("   - Launch your Next.js server") 
        print("   - Open browser")
        print("3. Close the window to stop the server")
        
        # Clean up build files
        if os.path.exists('build'):
            shutil.rmtree('build')
        if os.path.exists(f'{output_name}.spec'):
            os.remove(f'{output_name}.spec')
        if os.path.exists('dist'):
            shutil.rmtree('dist')
    else:
        print("\n❌ Build failed!")
        print("Make sure you have PyInstaller installed: pip3 install pyinstaller")

if __name__ == "__main__":
    build_launcher()