/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Electron
  output: 'export',
  
  // Disable image optimization (not available in static export)
  images: {
    unoptimized: true,
  },
  
  // Use empty assetPrefix for custom protocol (app://)
  assetPrefix: '',
  
  // Trailing slash helps with routing
  trailingSlash: true,
  
  // Environment variables (will be baked into the build)
  env: {
    NEXT_PUBLIC_API_BASE_URL: '',
    NEXT_PUBLIC_IS_ELECTRON: 'true',
  },
};

module.exports = nextConfig;
