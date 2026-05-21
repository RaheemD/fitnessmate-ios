/**
 * copy-web.js — Copies web files from project root into www/ for Capacitor.
 * Run with: node copy-web.js
 *
 * This is needed because Capacitor requires webDir to be a subdirectory,
 * but our web files (index.html, workout.html, etc.) live at the root.
 */

const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const DEST = path.join(__dirname, 'www');

// Directories and files to SKIP (not part of the web app)
const SKIP = new Set([
  'www',
  'node_modules',
  'ios',
  'android',
  '.git',
  '.gitignore',
  'package.json',
  'package-lock.json',
  'capacitor.config.json',
  'capacitor.config.ts',
  'copy-web.js',
  'netlify.toml',
  'netlify',
  '.netlify',
]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    ensureDir(dest);
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean and recreate www/
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true, force: true });
}
fs.mkdirSync(DEST, { recursive: true });

// Copy all web files
const entries = fs.readdirSync(SRC);
let copied = 0;

for (const entry of entries) {
  if (SKIP.has(entry)) continue;
  const srcPath = path.join(SRC, entry);
  const destPath = path.join(DEST, entry);
  copyRecursive(srcPath, destPath);
  copied++;
}

console.log(`✅ Copied ${copied} items into www/`);
