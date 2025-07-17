#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables for GitHub Pages build
process.env.GITHUB_ACTIONS = 'true';
process.env.GITHUB_REPOSITORY = 'MariaOlekheyko/learning-management';
process.env.NODE_ENV = 'production';

console.log('Building for GitHub Pages...');
console.log('Environment:', {
  GITHUB_ACTIONS: process.env.GITHUB_ACTIONS,
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
  NODE_ENV: process.env.NODE_ENV
});

try {
  // Clean dist directory
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
  }
  
  // Build the project
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('\nBuild completed successfully!');
  
  // Check the built files
  const distPath = './dist';
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    console.log('\nGenerated index.html:');
    console.log(indexContent);
    
    // Check if paths are correct
    const hasCorrectBase = indexContent.includes('/learning-management/');
    console.log(`\nCorrect base path found: ${hasCorrectBase}`);
    
    if (!hasCorrectBase) {
      console.error('ERROR: Base path is not correctly set in the built files!');
    }
  }
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}