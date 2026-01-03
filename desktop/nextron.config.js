module.exports = {
  // Nextron configuration for building the desktop app
  
  // Main process entry point
  mainSrcDir: 'main',
  
  // Renderer (Next.js) source directory
  rendererSrcDir: 'renderer',
  
  // Output directory for Electron app
  outputDir: 'dist',
  
  // Webpack configuration for main process
  webpack: (config, env) => {
    // Add any custom webpack config for main process here
    return config;
  },
};
