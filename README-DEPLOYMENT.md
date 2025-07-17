# ✨ Learning Platform - Spark Template

A comprehensive learning management system built with React, TypeScript, and modern web technologies.

## 🚀 Features

- **Course Management**: Browse and enroll in courses
- **Progress Tracking**: Monitor learning progress with visual indicators
- **Unified Profile**: Link multiple accounts (Microsoft, GitHub, LinkedIn)
- **AI Assistant**: Get personalized learning recommendations
- **Modern UI**: Clean, responsive design with Tailwind CSS

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm

### Setup
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build:gh
```

## 📦 Deployment

This project is configured for GitHub Pages deployment. The deployment happens automatically when you push to the main branch.

### GitHub Pages Setup
1. Go to your repository's Settings
2. Navigate to Pages
3. Set Source to "GitHub Actions"
4. The workflow will automatically build and deploy your site

### Troubleshooting 404 Errors
If you're getting 404 errors when accessing the deployed site:

1. **Check Repository Settings**: Ensure GitHub Pages is enabled and set to deploy from GitHub Actions
2. **Verify Base URL**: The project is configured with base URL `/spark-template/` for GitHub Pages
3. **Build Process**: Make sure the GitHub Actions workflow completes successfully
4. **File Paths**: All paths are configured to be relative to handle GitHub Pages deployment

### Manual Deployment
If you need to deploy manually:
```bash
npm run build:gh
# Upload the contents of the 'dist' folder to your hosting provider
```

## 🔧 Configuration

The project uses:
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **GitHub Spark** for enhanced functionality

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.