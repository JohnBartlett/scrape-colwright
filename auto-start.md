# 🚀 Automatic Startup Configuration

This guide explains how to configure automatic startup for the ColWright Inventory System.

## 📋 Cursor Integration

### .cursorrules File
The `.cursorrules` file in this directory provides Cursor with project-specific configuration:

- **Auto-start commands** when opening the directory
- **Quick commands** for development
- **File associations** for proper syntax highlighting
- **Workflow guidance** for development process
- **Troubleshooting** tips for common issues

### Cursor Auto-Start Features
When you open this directory in Cursor, you'll see:
- Project information in the sidebar
- Quick access to setup commands
- File type associations for proper editing
- Workflow guidance for development

## 🎯 Quick Start Options

### Option 1: Automated Setup Scripts
```bash
# Windows
npm run setup
# OR
powershell -ExecutionPolicy Bypass -File setup.ps1

# Unix/Linux/macOS
npm run setup-unix
# OR
./setup.sh
```

### Option 2: Batch File (Windows)
Double-click `start-server.bat` for instant startup

### Option 3: NPM Scripts
```bash
npm start              # Start server
npm run dev            # Development mode
npm run install-deps   # Install dependencies
```

## 🔧 Manual Configuration

### Windows Startup
1. **Create Shortcut**: Right-click `start-server.bat` → Create shortcut
2. **Add to Startup**: Press `Win+R` → `shell:startup` → Copy shortcut
3. **Auto-run**: System will automatically start the server on boot

### Unix/Linux/macOS Startup
1. **Create Service File**:
   ```bash
   sudo nano /etc/systemd/system/colwright.service
   ```

2. **Add Service Configuration**:
   ```ini
   [Unit]
   Description=ColWright Inventory System
   After=network.target

   [Service]
   Type=simple
   User=your-username
   WorkingDirectory=/path/to/scrape-colwright
   ExecStart=/usr/bin/node server.js
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. **Enable Service**:
   ```bash
   sudo systemctl enable colwright.service
   sudo systemctl start colwright.service
   ```

### macOS Startup
1. **Create Launch Agent**:
   ```bash
   nano ~/Library/LaunchAgents/com.colwright.inventory.plist
   ```

2. **Add Configuration**:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>Label</key>
       <string>com.colwright.inventory</string>
       <key>ProgramArguments</key>
       <array>
           <string>/usr/local/bin/node</string>
           <string>/path/to/scrape-colwright/server.js</string>
       </array>
       <key>WorkingDirectory</key>
       <string>/path/to/scrape-colwright</string>
       <key>RunAtLoad</key>
       <true/>
       <key>KeepAlive</key>
       <true/>
   </dict>
   </plist>
   ```

3. **Load Agent**:
   ```bash
   launchctl load ~/Library/LaunchAgents/com.colwright.inventory.plist
   ```

## 🌐 Remote Access Setup

### Cloudflare Tunnel (Recommended)
```bash
# Install cloudflared
# Windows: Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
# Unix: curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o cloudflared

# Create tunnel
cloudflared tunnel create colwright-inventory

# Configure tunnel
cloudflared tunnel route dns colwright-inventory your-domain.com

# Start tunnel
cloudflared tunnel run colwright-inventory
```

### Auto-start Tunnel
Add tunnel startup to your system's startup configuration:

**Windows:**
```batch
@echo off
cd /d "C:\path\to\scrape-colwright"
start /B cloudflared tunnel run colwright-inventory
```

**Unix/Linux:**
```bash
# Add to crontab
@reboot /usr/local/bin/cloudflared tunnel run colwright-inventory
```

## 🔄 Development Workflow

### Recommended Workflow
1. **Open Cursor** in the project directory
2. **Run setup script** to check dependencies
3. **Start server** with `npm start`
4. **Access interfaces**:
   - Gallery: http://localhost:3000
   - Review: http://localhost:3000/review.html
5. **For remote access**: Start Cloudflare Tunnel

### Cursor Commands
- `Ctrl+Shift+P` → "Run Task" → Select setup or start commands
- Use the integrated terminal for server management
- Leverage Cursor's file associations for proper editing

## 🛠️ Troubleshooting Auto-Start

### Common Issues
1. **Permission Denied**: Run as Administrator (Windows) or use sudo (Unix)
2. **Port Already in Use**: Check for existing processes with `netstat -an | findstr :3000`
3. **Node.js Not Found**: Ensure Node.js is in your system PATH
4. **Dependencies Missing**: Run `npm install` before starting

### Debug Commands
```bash
# Check if server is running
npm run check-status

# Check Node.js installation
node --version

# Check dependencies
npm list

# Check port usage
netstat -an | findstr :3000  # Windows
lsof -i :3000                # Unix
```

## 📞 Support

For auto-start issues:
1. Check the console output for error messages
2. Verify all paths in configuration files
3. Ensure proper permissions for startup scripts
4. Test manual startup before configuring auto-start

---

**Auto-start configuration ensures your ColWright Inventory System is always ready when you need it!** 🚀 