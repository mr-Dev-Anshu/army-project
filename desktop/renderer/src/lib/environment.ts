/**
 * Environment Detection Utilities
 * 
 * Provides helper functions to detect the runtime environment
 * and conditionally execute code for web vs desktop.
 */

// Check if running in Electron
export const isElectron = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (window as any).electronAPI !== undefined;
};

// Check if running in browser
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

// Check if running in development
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Check if running in production
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

// Get the appropriate base URL for API calls
export const getApiBaseUrl = (): string => {
  if (isElectron()) {
    return ''; // Use local database adapter
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || '';
};

// Execute function only in Electron environment
export const runInElectron = <T>(fn: () => T): T | null => {
  if (isElectron()) {
    return fn();
  }
  return null;
};

// Execute function only in browser (non-Electron) environment
export const runInBrowser = <T>(fn: () => T): T | null => {
  if (isBrowser() && !isElectron()) {
    return fn();
  }
  return null;
};

// Get Electron API (with type safety)
export const getElectronAPI = () => {
  if (isElectron()) {
    return (window as any).electronAPI;
  }
  return null;
};
