# Army Project Desktop - Nextron/Electron Setup

This directory contains the Nextron-based desktop application wrapper for the Army Project.

## Prerequisites

- Node.js 18+ installed on the development machine
- Windows OS for building Windows EXE

## Project Structure

```
desktop/
├── main/
│   ├── background.js      # Electron main process
│   └── preload.js         # Secure preload script
├── renderer/
│   ├── src/               # Next.js application (copied from main project)
│   ├── public/            # Static assets including fonts
│   ├── next.config.js     # Next.js config for static export
│   └── tsconfig.json      # TypeScript configuration
├── resources/
│   └── icon.ico           # Application icon (256x256 ICO)
├── nextron.config.js      # Nextron configuration
├── package.json           # Desktop app dependencies
└── setup.js               # Setup script
```

## Initial Setup

### 1. Copy Source Files

Run the setup script to copy the Next.js app to the renderer directory:

```bash
cd desktop
node setup.js
```

### 2. Download Inter Font

Download Inter font files from [Google Fonts](https://fonts.google.com/specimen/Inter) and place them in:
`renderer/public/fonts/`

Required files:
- Inter-Regular.woff2
- Inter-Medium.woff2
- Inter-SemiBold.woff2
- Inter-Bold.woff2
(and other weights as needed)

### 3. Create Application Icon

Create a 256x256 ICO file and save it as:
`resources/icon.ico`

You can use tools like [ICO Convert](https://icoconvert.com/) to create ICO files.

### 4. Install Dependencies

```bash
cd desktop
npm install
```

Also install Dexie for the offline database:

```bash
cd renderer
npm install dexie
```

## Development

Start the development server with hot reload:

```bash
npm run dev
```

This will:
1. Start Next.js dev server on port 3000
2. Launch Electron with the Next.js app
3. Enable DevTools for debugging

## Building for Production

### Build the Application

```bash
npm run build
```

This will:
1. Build Next.js in production mode with static export
2. Bundle the output into the Electron app

### Create Windows EXE

```bash
npm run dist
```

This creates:
- `release/Army Project-1.0.0-Setup.exe` - NSIS installer
- `release/Army Project-1.0.0-Portable.exe` - Portable executable

## How Offline Loading Works

### 1. Static Export

Next.js is configured with `output: 'export'` which generates static HTML/CSS/JS files. These are bundled directly into the Electron app.

### 2. File Protocol

In production, the app loads from `app://./index.html` using `electron-serve`. This serves files from the bundled `app/` directory without requiring any server.

### 3. Local Database

Instead of MongoDB (which requires a server), the desktop app uses IndexedDB via Dexie.js:
- Data persists in the browser's IndexedDB
- Automatically syncs with the app's state
- Same API patterns as the original MongoDB implementation

### 4. Local Fonts

Google Fonts are replaced with locally bundled font files to avoid network requests.

### 5. Asset Bundling

All images, CSS, and JavaScript are bundled into the app directory and loaded via relative paths.

## Security Features

- `nodeIntegration: false` - Prevents renderer from accessing Node.js
- `contextIsolation: true` - Isolates preload scripts
- `sandbox: true` - Enables Chromium sandbox
- `enableRemoteModule: false` - Disables remote module
- DevTools disabled in production
- External navigation blocked

## Troubleshooting

### White Screen on Launch

1. Check the DevTools console (dev mode) for errors
2. Verify all assets are bundled correctly
3. Check that `next export` completed successfully

### Missing Fonts

1. Verify font files exist in `renderer/public/fonts/`
2. Check `inter.css` has correct paths
3. Ensure fonts are referenced in `globals.css`

### Database Errors

1. Clear IndexedDB data: DevTools > Application > IndexedDB
2. Check browser console for Dexie errors
3. Verify database schema matches your data

### Build Failures

1. Clear `node_modules` and reinstall
2. Delete `.next` and `dist` directories
3. Check Node.js version (18+ required)

## Environment Variables

For the desktop app, environment variables are baked in at build time:

```js
// next.config.js
env: {
  NEXT_PUBLIC_API_BASE_URL: '',  // Empty for offline mode
  NEXT_PUBLIC_IS_ELECTRON: 'true',
}
```

## Validation Checklist

Before releasing:

- [ ] EXE runs with no internet connection
- [ ] UI loads without white screen
- [ ] All fonts render correctly
- [ ] All images and icons display
- [ ] Form submissions work (save to IndexedDB)
- [ ] Data persists after restart
- [ ] Reports generate correctly
- [ ] No console errors in production
- [ ] App closes cleanly

## Support

For issues specific to:
- **Nextron**: https://github.com/nicedoc/nextron
- **Electron**: https://www.electronjs.org/docs
- **Next.js Static Export**: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
