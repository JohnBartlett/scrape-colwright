# Hamilton Estate Inventory System - Server Setup

## Quick Start

### Option 1: Use Batch Files (Recommended)
1. Double-click `start-server.bat` to start the server
2. Double-click `stop-server.bat` to stop the server

### Option 2: Use PowerShell Scripts Directly
1. Right-click `start-server.ps1` → "Run with PowerShell"
2. Right-click `stop-server.ps1` → "Run with PowerShell"

## If Windows Asks About Default Programs

If you see a popup asking "How do you want to open this file?":

1. Click **"More apps"**
2. Select **"Windows PowerShell"**
3. Check **"Always use this app"** if you want to avoid this in the future
4. Click **"OK"**

## What the Scripts Do

### Start Script:
- ✅ Kills existing Node.js and Cloudflare processes
- ✅ Starts the web server on http://localhost:3000
- ✅ Creates a Cloudflare tunnel for remote access
- ✅ Shows login credentials and access URLs

### Stop Script:
- ✅ Stops all server and tunnel processes
- ✅ Cleans up port 3000
- ✅ Provides status confirmation

## Access Information

### Local Access:
- **URL**: http://localhost:3000
- **Login Page**: Automatically redirects to login

### Remote Access:
- **URL**: Check the Cloudflare tunnel window for the URL
- **Format**: https://[random-name].trycloudflare.com

### Login Credentials:
- **John (Admin)**: `2Dream1420!`
- **Caroline (Admin)**: `2Dream1420!`
- **Catharine (Viewer)**: `cch1500`

## Troubleshooting

### If the server won't start:
1. Make sure Node.js is installed
2. Run `npm install` if dependencies are missing
3. Check if port 3000 is already in use

### If the tunnel won't start:
1. Make sure cloudflared is installed
2. Check your internet connection
3. Try running the script again

### If you get permission errors:
1. Right-click the batch file
2. Select "Run as administrator"

## Manual Commands

If the scripts don't work, you can run these commands manually:

```bash
# Start server
node server.js

# Start tunnel (in a separate window)
cloudflared tunnel --url http://localhost:3000
``` 