#!/bin/bash

# 🚀 ColWright Inventory System Setup Script
# This script automatically sets up and starts the web server

echo "🎯 ColWright Inventory System Setup"
echo "====================================="

# Check if Node.js is installed
echo ""
echo "📋 Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js from https://nodejs.org/"
    echo "   After installation, run this script again."
    exit 1
fi

# Check if npm is available
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: $NPM_VERSION"
else
    echo "❌ npm not found. Please ensure Node.js is properly installed."
    exit 1
fi

# Install dependencies
echo ""
echo "📥 Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies. Trying with force..."
    rm -rf node_modules
    if npm install; then
        echo "✅ Dependencies installed successfully after cleanup"
    else
        echo "❌ Failed to install dependencies. Please check your internet connection and try again."
        exit 1
    fi
fi

# Check if database exists
echo ""
echo "🗄️ Checking database..."
if [ -f "inventory.db" ]; then
    echo "✅ Database found: inventory.db"
else
    echo "⚠️ Database not found. It will be created when the server starts."
fi

# Check if images directory exists
echo ""
echo "🖼️ Checking images directory..."
if [ -d "images" ]; then
    IMAGE_COUNT=$(find images -name "*.jpg" | wc -l)
    echo "✅ Images directory found with $IMAGE_COUNT images"
else
    echo "⚠️ Images directory not found. Creating empty directory..."
    mkdir -p images
    echo "✅ Images directory created"
fi

# Start the server
echo ""
echo "🌐 Starting web server..."
echo "   Server will be available at:"
echo "   • Local: http://localhost:3000"
echo "   • Network: http://[your-ip]:3000"
echo ""
echo "   Press Ctrl+C to stop the server"
echo "====================================="

# Start the server
if ! node server.js; then
    echo ""
    echo "❌ Failed to start server. Please check the error messages above."
    exit 1
fi 