/**
 * Complete Build Script for Army Project Desktop Application
 * 
 * This script automates the entire build process:
 * 1. Copies source files from the main Next.js project
 * 2. Installs dependencies
 * 3. Builds the Next.js app
 * 4. Packages the Electron app
 * 
 * Run with: node desktop/build-desktop.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const desktopDir = __dirname;
const rendererDir = path.join(desktopDir, 'renderer');

function log(message) {
  console.log(`\n📦 ${message}\n`);
}

function exec(command, cwd = desktopDir) {
  console.log(`> ${command}`);
  execSync(command, { stdio: 'inherit', cwd, shell: true });
}

// Directories and files to copy
const itemsToCopy = [
  { src: 'src/common', dest: 'src/common' },
  { src: 'src/components', dest: 'src/components' },
  { src: 'src/context', dest: 'src/context' },
  { src: 'src/features', dest: 'src/features' },
  { src: 'src/apis', dest: 'src/apis' },
  { src: 'src/config/tanstack', dest: 'src/config/tanstack' },
  { src: 'src/utils', dest: 'src/utils' },
  { src: 'src/lib/utils.ts', dest: 'src/lib/utils.ts' },
  { src: 'src/lib/fieldSuggestionTracker.js', dest: 'src/lib/fieldSuggestionTracker.js' },
  { src: 'src/lib/fieldSuggestionConfig', dest: 'src/lib/fieldSuggestionConfig' },
  { src: 'public', dest: 'public' },
  { src: 'postcss.config.mjs', dest: 'postcss.config.mjs' },
  { src: 'components.json', dest: 'components.json' },
];

// App pages to copy
const pagesToCopy = [
  'src/app/page.tsx',
  'src/app/general-traffic-offence-reports',
  'src/app/mp-occurrence-reports',
  'src/app/static-speed-check-reports',
  'src/app/test-report-ui',
  'src/app/hello',
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`  Skipping (not found): ${src}`);
    return;
  }

  const stat = fs.statSync(src);

  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    for (const item of items) {
      copyRecursive(path.join(src, item), path.join(dest, item));
    }
  } else {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

function build() {
  log('Step 1: Copying source files...');
  
  // Copy main items
  for (const item of itemsToCopy) {
    const srcPath = path.join(rootDir, item.src);
    const destPath = path.join(rendererDir, item.dest);
    console.log(`  Copying: ${item.src}`);
    copyRecursive(srcPath, destPath);
  }

  // Copy pages
  for (const page of pagesToCopy) {
    const srcPath = path.join(rootDir, page);
    const destPath = path.join(rendererDir, page);
    console.log(`  Copying: ${page}`);
    copyRecursive(srcPath, destPath);
  }

  log('Step 2: Installing renderer dependencies...');
  exec('npm install', rendererDir);

  log('Step 3: Installing desktop dependencies...');
  exec('npm install', desktopDir);

  log('Step 4: Building for production...');
  exec('npm run dist', desktopDir);

  log('✅ Build complete!');
  console.log('\nOutput files can be found in: desktop/release/');
  console.log('- Army Project-1.0.0-Setup.exe (Installer)');
  console.log('- Army Project-1.0.0-Portable.exe (Portable)');
}

// Check for required files
function checkPrerequisites() {
  const iconPath = path.join(desktopDir, 'resources', 'icon.ico');
  if (!fs.existsSync(iconPath)) {
    console.warn('\n⚠️  Warning: icon.ico not found in resources/');
    console.warn('   Create a 256x256 ICO file for the application icon.\n');
  }

  const fontsDir = path.join(rendererDir, 'public', 'fonts');
  const interRegular = path.join(fontsDir, 'Inter-Regular.woff2');
  if (!fs.existsSync(interRegular)) {
    console.warn('\n⚠️  Warning: Inter font files not found in renderer/public/fonts/');
    console.warn('   Download from: https://fonts.google.com/specimen/Inter\n');
  }
}

checkPrerequisites();
build();
