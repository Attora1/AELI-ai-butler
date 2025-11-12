#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync, renameSync, copyFileSync } from 'fs';
import { join } from 'path';

const srcDir = './src';
const indexPath = join(srcDir, 'index.html');
const indexBackupPath = join(srcDir, 'index-original.html');
const indexCleanPath = join(srcDir, 'index-clean.html');

// Backup existing index.html if it exists
if (existsSync(indexPath) && !existsSync(indexBackupPath)) {
  console.log('📦 Backing up original index.html...');
  renameSync(indexPath, indexBackupPath);
}

// Copy clean index to index.html
if (existsSync(indexCleanPath)) {
  console.log('🔄 Using clean index.html...');
  copyFileSync(indexCleanPath, indexPath);
}

// Start Vite
console.log('🚀 Starting AELI Clean Version...');
const vite = spawn('npx', ['vite', '--config', 'vite-clean.config.js'], {
  stdio: 'inherit',
  shell: true
});

// Restore original on exit
process.on('SIGINT', () => {
  console.log('\n🔄 Restoring original files...');
  if (existsSync(indexBackupPath)) {
    if (existsSync(indexPath)) {
      // Remove the clean version
      unlinkSync(indexPath);
    }
    renameSync(indexBackupPath, indexPath);
  }
  process.exit();
});

vite.on('exit', (code) => {
  process.exit(code);
});
