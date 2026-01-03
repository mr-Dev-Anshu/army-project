/**
 * TypeScript declarations for Electron API exposed via preload script
 */

interface ElectronStore {
  get: (key: string) => Promise<any>;
  set: (key: string, value: any) => Promise<boolean>;
  delete: (key: string) => Promise<boolean>;
}

interface ElectronAPI {
  platform: string;
  store: ElectronStore;
  getAppVersion: () => Promise<string>;
  saveFile: (filename: string, data: any) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
