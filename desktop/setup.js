/**
 * Setup Script for Nextron Desktop Application
 * 
 * This script copies the existing Next.js application to the desktop/renderer
 * directory and applies necessary modifications for offline Electron operation.
 * 
 * Run with: node desktop/setup.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const desktopDir = __dirname;
const rendererDir = path.join(desktopDir, 'renderer');

// Directories and files to copy from the main project
const itemsToCopy = [
  'src',
  'public',
  'postcss.config.mjs',
  'tailwind.config.ts',
  'components.json',
];

// Files to skip (we'll create custom versions)
const skipFiles = [
  'src/lib/db/mongodb.js',
  'src/app/api',
];

function copyRecursive(src, dest, skipPatterns = []) {
  // Check if should skip
  const relativePath = path.relative(rootDir, src);
  for (const pattern of skipPatterns) {
    if (relativePath.startsWith(pattern) || relativePath === pattern) {
      console.log(`Skipping: ${relativePath}`);
      return;
    }
  }

  if (!fs.existsSync(src)) {
    console.log(`Source not found: ${src}`);
    return;
  }

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    for (const item of items) {
      copyRecursive(
        path.join(src, item),
        path.join(dest, item),
        skipPatterns
      );
    }
  } else {
    // Copy file
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${path.relative(rootDir, src)}`);
  }
}

function setup() {
  console.log('Setting up Nextron desktop application...\n');

  // Ensure renderer/src directory exists
  if (!fs.existsSync(path.join(rendererDir, 'src'))) {
    fs.mkdirSync(path.join(rendererDir, 'src'), { recursive: true });
  }

  // Copy items
  for (const item of itemsToCopy) {
    const srcPath = path.join(rootDir, item);
    const destPath = path.join(rendererDir, item);
    
    console.log(`\nCopying ${item}...`);
    copyRecursive(srcPath, destPath, skipFiles);
  }

  // Copy public assets
  const publicSrc = path.join(rootDir, 'public');
  const publicDest = path.join(rendererDir, 'public');
  if (fs.existsSync(publicSrc)) {
    copyRecursive(publicSrc, publicDest, []);
  }

  console.log('\n✅ Setup complete!');
  console.log('\nNext steps:');
  console.log('1. cd desktop');
  console.log('2. npm install');
  console.log('3. Download Inter font files to renderer/public/fonts/');
  console.log('4. npm run dev (for development)');
  console.log('5. npm run dist (for production EXE)');
}

setup();
