#!/bin/bash

# Room Finder Deployment Script with Vite 7
echo "Starting Room Finder deployment process with Vite 7..."

# Navigate to the server directory and install dependencies
echo "Installing server dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install server dependencies"
    exit 1
fi

# Navigate to the CORRECT client directory (Vite 7) and install dependencies, then build
echo "Installing client dependencies (Vite 7) and building frontend..."
cd ../client/room-finder
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install client dependencies (Vite 7)"
    exit 1
fi

npm run build

if [ $? -ne 0 ]; then
    echo "Failed to build client application (Vite 7)"
    exit 1
fi

echo "Build completed successfully with Vite 7!"
echo "To start the application, run 'npm start' from the root directory."