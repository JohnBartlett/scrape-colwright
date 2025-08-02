@echo off
REM 🚀 ColWright Inventory System - Quick Start
REM This batch file quickly starts the web server

echo 🎯 ColWright Inventory System v1.8.0
echo =====================================

REM Check if Node.js is installed
echo.
echo 📋 Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
echo 📦 Checking dependencies...
if not exist "node_modules" (
    echo 📥 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Start the server
echo.
echo 🌐 Starting web server...
echo    Server will be available at:
echo    • Local: http://localhost:3000
echo    • Network: http://[your-ip]:3000
echo.
echo    Press Ctrl+C to stop the server
echo =====================================

node server.js

pause 