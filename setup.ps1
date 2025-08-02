# 🚀 ColWright Inventory System Setup Script
# This script automatically sets up and starts the web server

Write-Host "🎯 ColWright Inventory System Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`n📋 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "   After installation, run this script again." -ForegroundColor Red
    exit 1
}

# Check if npm is available
Write-Host "`n📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please ensure Node.js is properly installed." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📥 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies. Trying with force..." -ForegroundColor Red
    try {
        Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
        npm install
        Write-Host "✅ Dependencies installed successfully after cleanup" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install dependencies. Please check your internet connection and try again." -ForegroundColor Red
        exit 1
    }
}

# Check if database exists
Write-Host "`n🗄️ Checking database..." -ForegroundColor Yellow
if (Test-Path "inventory.db") {
    Write-Host "✅ Database found: inventory.db" -ForegroundColor Green
} else {
    Write-Host "⚠️ Database not found. It will be created when the server starts." -ForegroundColor Yellow
}

# Check if images directory exists
Write-Host "`n🖼️ Checking images directory..." -ForegroundColor Yellow
if (Test-Path "images") {
    $imageCount = (Get-ChildItem "images" -Filter "*.jpg" | Measure-Object).Count
    Write-Host "✅ Images directory found with $imageCount images" -ForegroundColor Green
} else {
    Write-Host "⚠️ Images directory not found. Creating empty directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "images" -Force | Out-Null
    Write-Host "✅ Images directory created" -ForegroundColor Green
}

# Start the server
Write-Host "`n🌐 Starting web server..." -ForegroundColor Yellow
Write-Host "   Server will be available at:" -ForegroundColor Cyan
Write-Host "   • Local: http://localhost:3000" -ForegroundColor White
Write-Host "   • Network: http://[your-ip]:3000" -ForegroundColor White
Write-Host "`n   Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor Cyan

# Start the server
try {
    node server.js
} catch {
    Write-Host "`n❌ Failed to start server. Please check the error messages above." -ForegroundColor Red
    exit 1
} 