#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distPath = './dist';
const indexPath = path.join(distPath, 'index.html');

console.log('Post-processing build for GitHub Pages...');

if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Replace asset paths with proper GitHub Pages paths
  content = content.replace(/src="\/assets\//g, 'src="/learning-management/assets/');
  content = content.replace(/href="\/assets\//g, 'href="/learning-management/assets/');
  
  fs.writeFileSync(indexPath, content);
  console.log('✓ Updated asset paths in index.html');
  
  // Verify the changes
  const updatedContent = fs.readFileSync(indexPath, 'utf8');
  const hasCorrectPaths = updatedContent.includes('/learning-management/assets/');
  
  console.log(`✓ Correct asset paths: ${hasCorrectPaths}`);
  
  if (!hasCorrectPaths) {
    console.error('✗ Failed to update asset paths properly');
    process.exit(1);
  }
} else {
  console.error('✗ index.html not found in dist directory');
  process.exit(1);
}

console.log('Post-processing completed successfully!');