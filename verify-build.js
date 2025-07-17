#!/usr/bin/env node

// Simple verification script to check if build artifacts are correct
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distPath = './dist';
const indexPath = join(distPath, 'index.html');

if (!existsSync(distPath)) {
  console.error('❌ Build directory not found');
  process.exit(1);
}

if (!existsSync(indexPath)) {
  console.error('❌ index.html not found in build directory');
  process.exit(1);
}

try {
  const indexContent = readFileSync(indexPath, 'utf-8');
  
  // Check if the HTML contains the expected structure
  if (!indexContent.includes('<div id="root">')) {
    console.error('❌ Root div not found in index.html');
    process.exit(1);
  }
  
  // Check if assets are properly referenced
  if (indexContent.includes('src="/') && process.env.GITHUB_ACTIONS === 'true') {
    console.error('❌ Absolute paths found in GitHub Actions build - should use relative paths');
    process.exit(1);
  }
  
  console.log('✅ Build verification passed');
  console.log('📁 Build artifacts are ready for deployment');
  
} catch (error) {
  console.error('❌ Failed to verify build:', error.message);
  process.exit(1);
}