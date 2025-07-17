#!/bin/bash

echo "Building project..."
npx vite build

echo "Build completed. Contents of dist directory:"
ls -la dist/

echo "Index.html contents:"
cat dist/index.html

echo "Done."