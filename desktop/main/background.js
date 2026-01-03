const path = require('path');
const { app, BrowserWindow, protocol, net } = require('electron');
const fs = require('fs');
const url = require('url');

// Determine if running in production
const isProd = !process.defaultApp;

// Path to the static files
const staticPath = path.join(__dirname, '..', 'renderer', 'out');

// Disable GPU acceleration if needed for compatibility
app.disableHardwareAcceleration();

// Register custom protocol scheme before app ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      // Security settings
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Need to disable for file protocol handling
      webSecurity: true,
      allowRunningInsecureContent: false,
      
      // Preload script for secure IPC
      preload: path.join(__dirname, 'preload.js'),
    },
    // Window appearance
    show: false,
    backgroundColor: '#f9fafb',
    autoHideMenuBar: true,
  });

  // Prevent new windows from being opened
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  // Show window when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Disable DevTools in production
  if (isProd) {
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  // Load the app using custom protocol
  await mainWindow.loadURL('app://./index.html');

  // Open DevTools in development
  if (!isProd) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Get MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.txt': 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// App ready
app.whenReady().then(() => {
  // Register custom protocol handler for app:// URLs
  protocol.handle('app', (request) => {
    let urlPath = request.url.slice('app://'.length);
    
    // Remove leading ./ or /
    urlPath = urlPath.replace(/^\.?\//, '');
    
    // Handle empty path or root
    if (!urlPath || urlPath === '' || urlPath === './') {
      urlPath = 'index.html';
    }
    
    // Build the file path
    let filePath = path.join(staticPath, urlPath);
    
    // If path doesn't have extension and doesn't exist, try adding /index.html
    if (!path.extname(filePath)) {
      const indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
      } else {
        // Try with .html extension
        const htmlPath = filePath + '.html';
        if (fs.existsSync(htmlPath)) {
          filePath = htmlPath;
        }
      }
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      // Return 404 page or index.html for SPA routing
      filePath = path.join(staticPath, '404.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(staticPath, 'index.html');
      }
    }
    
    return net.fetch(url.pathToFileURL(filePath).toString());
  });

  createWindow();
});

// Quit when all windows are closed (Windows/Linux behavior)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// macOS: Recreate window when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
