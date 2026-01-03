const { contextBridge, ipcRenderer } = require('electron');

// Expose a safe, limited API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  
  // Persistent storage operations (for offline data)
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
  },
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // File system (if needed for reports)
  saveFile: (filename, data) => ipcRenderer.invoke('save-file', filename, data),
});

// Freeze the exposed API to prevent tampering
Object.freeze(window.electronAPI);
