import tkinter as tk
from tkinter import ttk
import subprocess
import threading
import time
import webbrowser
import os
import sys
import ctypes

class ArmyProjectLauncher:
    def __init__(self):
        # Check if running as admin on Windows
        if os.name == 'nt' and not self.is_admin():
            self.request_admin()
            return
            
        self.root = tk.Tk()
        self.root.title("Army Project Launcher")
        self.root.geometry("400x180")
        self.root.resizable(False, False)
        self.root.configure(bg='#1e1e1e')
        
        # Center the window
        self.root.eval('tk::PlaceWindow . center')
        
        # Title frame
        title_frame = tk.Frame(self.root, bg='#1e1e1e')
        title_frame.pack(pady=(15, 10))
        
        title_label = tk.Label(
            title_frame,
            text="ARMY PROJECT LAUNCHER",
            font=("Segoe UI", 14, "bold"),
            fg='#0078d4',
            bg='#1e1e1e'
        )
        title_label.pack()
        
        separator = tk.Frame(self.root, height=2, bg='#0078d4')
        separator.pack(fill='x', padx=20, pady=(0, 15))
        
        # Status label
        self.status_label = tk.Label(
            self.root,
            text="Starting server...",
            font=("Segoe UI", 11),
            fg='#ffffff',
            bg='#1e1e1e'
        )
        self.status_label.pack(pady=(0, 15))
        
        # Progress bar
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("Custom.Horizontal.TProgressbar",
                       background='#0078d4',
                       troughcolor='#2d2d30',
                       borderwidth=0,
                       lightcolor='#0078d4',
                       darkcolor='#0078d4')
        
        self.progress = ttk.Progressbar(
            self.root,
            style="Custom.Horizontal.TProgressbar",
            mode='indeterminate',
            length=320
        )
        self.progress.pack(pady=(0, 20))
        self.progress.start(8)
        
        # Variables
        self.npm_process = None
        
        # Handle window closing
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
        # Start the server in a separate thread
        threading.Thread(target=self.start_server, daemon=True).start()
    
    def is_admin(self):
        try:
            return ctypes.windll.shell32.IsUserAnAdmin()
        except:
            return False
    
    def request_admin(self):
        if os.name == 'nt':
            try:
                # Re-run the program with admin privileges
                if getattr(sys, 'frozen', False):
                    # Running as exe
                    ctypes.windll.shell32.ShellExecuteW(
                        None, "runas", sys.executable, "", None, 1
                    )
                else:
                    # Running as script
                    ctypes.windll.shell32.ShellExecuteW(
                        None, "runas", sys.executable, f'"{__file__}"', None, 1
                    )
            except:
                pass
        sys.exit()
    
    def start_server(self):
        try:
            # Update status - admin privileges confirmed
            self.update_status("✅ Admin privileges confirmed")
            time.sleep(0.5)
            
            # Start MongoDB
            self.update_status("🗄️ Starting MongoDB service...")
            time.sleep(0.5)
            try:
                if os.name == 'nt':
                    result = subprocess.run(['net', 'start', 'MongoDB'], 
                                          capture_output=True, check=False, shell=True)
                    if result.returncode == 0:
                        self.update_status("✅ MongoDB service started")
                    else:
                        self.update_status("⚠️ MongoDB already running or not found")
                else:
                    # For Linux/Mac
                    result = subprocess.run(['sudo', 'systemctl', 'start', 'mongod'], 
                                          capture_output=True, check=False)
                    if result.returncode == 0:
                        self.update_status("✅ MongoDB service started")
                    else:
                        self.update_status("⚠️ MongoDB already running or not found")
            except:
                self.update_status("⚠️ MongoDB service not available")
            time.sleep(0.5)
            
            # Find project directory
            project_path = self.find_project_directory()
            if not project_path:
                raise Exception("Could not find package.json. Place the exe in your project folder.")
            
            # Start npm
            self.update_status("🚀 Starting Next.js server...")
            time.sleep(1)
            
            # Create npm process
            if os.name == 'nt':
                self.npm_process = subprocess.Popen(
                    ['npm', 'start'],
                    cwd=project_path,
                    shell=True,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    creationflags=subprocess.CREATE_NO_WINDOW
                )
            else:
                self.npm_process = subprocess.Popen(
                    ['npm', 'start'],
                    cwd=project_path,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    preexec_fn=os.setsid
                )
            
            # Wait for server to start
            time.sleep(3)
            
            # Open browser
            webbrowser.open('http://localhost:3000')
            
            # Update UI - show that server is running and window must stay open
            self.update_status("🟢 Server running - Close window to stop server")
            self.progress.stop()
            self.progress.configure(mode='determinate', value=100)
            self.root.title("Army Project - Running (Close to stop)")
            
            # Keep monitoring server
            self.root.after(1000, self.check_server_status)
            
        except Exception as e:
            self.update_status(f"❌ Error: {str(e)}")
            self.progress.stop()
            self.progress.configure(mode='determinate', value=100)
    
    def find_project_directory(self):
        # Start from script directory
        if getattr(sys, 'frozen', False):
            # Running as exe
            current_dir = os.path.dirname(sys.executable)
        else:
            # Running as script
            current_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Check current directory and parent directories
        while current_dir:
            package_json = os.path.join(current_dir, 'package.json')
            if os.path.exists(package_json):
                return current_dir
            
            parent = os.path.dirname(current_dir)
            if parent == current_dir:  # Reached root
                break
            current_dir = parent
        
        return None
    
    def check_server_status(self):
        if self.npm_process:
            if self.npm_process.poll() is None:
                # Server is still running
                self.update_status("🟢 Server running - Close window to stop server")
                self.root.after(2000, self.check_server_status)  # Check again in 2 seconds
            else:
                # Server stopped unexpectedly
                self.update_status("❌ Server stopped - You can close this window")
                self.progress.configure(value=0)
    
    def update_status(self, text):
        self.root.after(0, lambda: self.status_label.config(text=text))
    
    def on_closing(self):
        if self.npm_process:
            try:
                # Kill the entire process tree
                if os.name == 'nt':
                    subprocess.run(['taskkill', '/F', '/T', '/PID', str(self.npm_process.pid)], 
                                 capture_output=True, shell=True)
                else:
                    # For Unix-like systems
                    import signal
                    os.killpg(os.getpgid(self.npm_process.pid), signal.SIGTERM)
            except:
                pass
        self.root.destroy()
    
    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = ArmyProjectLauncher()
    app.run()