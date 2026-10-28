/**
 * Derby2party - Production Build Script
 * Generates an optimized, self-contained /dist directory ready for production deployment
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');

console.log('\n🚀 Starting Derby2party production build...\n');

// 1. Clean and recreate dist directory
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// Helper to recursively copy directories
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 2. Copy static files & directories
console.log('📦 Copying application assets & source files to /dist...');
copyRecursive(path.join(ROOT, 'src'), path.join(DIST, 'src'));
copyRecursive(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
fs.copyFileSync(path.join(ROOT, 'README.md'), path.join(DIST, 'README.md'));
fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(DIST, 'package.json'));

// 3. Calculate file sizes and build statistics
function getDirStats(dir) {
  let count = 0;
  let totalBytes = 0;
  const fileList = [];

  function walk(current) {
    for (const item of fs.readdirSync(current)) {
      const fullPath = path.join(current, item);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        walk(fullPath);
      } else {
        count++;
        totalBytes += stats.size;
        fileList.push({
          relPath: path.relative(DIST, fullPath),
          size: stats.size
        });
      }
    }
  }

  walk(dir);
  return { count, totalBytes, fileList };
}

const stats = getDirStats(DIST);
const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// 4. Verify critical assets
const criticalFiles = [
  'index.html',
  'src/data/matchs.json',
  'src/css/style.css',
  'src/js/app.js',
  'src/js/stepper.js',
  'src/js/confetti.js',
  'assets/hero.mp4',
  'assets/hero.jpg',
  'assets/ambiance.mp4',
  'assets/food.jpg',
  'assets/wax-pattern.svg'
];

let allValid = true;
console.log('\n🔍 Verifying critical production assets:');
for (const f of criticalFiles) {
  const p = path.join(DIST, f);
  if (fs.existsSync(p)) {
    const s = fs.statSync(p);
    console.log(`  ✔ [OK] ${f} (${formatSize(s.size)})`);
  } else {
    console.error(`  ✖ [MISSING] ${f}`);
    allValid = false;
  }
}

if (!allValid) {
  console.error('\n❌ Build failed: Some critical files are missing.\n');
  process.exit(1);
}

console.log('\n============================================================');
console.log('✅ DERBY2PARTY PRODUCTION BUILD SUCCESSFUL!');
console.log(`📁 Destination : ${DIST}`);
console.log(`📄 Total files : ${stats.count}`);
console.log(`📊 Total size  : ${formatSize(stats.totalBytes)}`);
console.log('🚀 Ready to deploy on Vercel, Netlify, Cloudflare Pages, or static CDN!');
console.log('============================================================\n');
