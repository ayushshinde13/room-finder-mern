@echo off
REM Room Finder Deployment Script for Windows with Vite 7

echo Starting Room Finder deployment process with Vite 7...

REM Navigate to the server directory and install dependencies
echo Installing server dependencies...
cd server
npm install

if %errorlevel% neq 0 (
    echo Failed to install server dependencies
    pause
    exit /b 1
)

REM Navigate to the CORRECT client directory (Vite 7) and install dependencies, then build
echo Installing client dependencies (Vite 7) and building frontend...
cd ..\client\room-finder
npm install

if %errorlevel% neq 0 (
    echo Failed to install client dependencies (Vite 7)
    pause
    exit /b 1
)

npm run build

if %errorlevel% neq 0 (
    echo Failed to build client application (Vite 7)
    pause
    exit /b 1
)

echo Build completed successfully with Vite 7!
echo To start the application, run 'npm start' from the root directory.
pause