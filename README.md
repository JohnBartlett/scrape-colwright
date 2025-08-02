# 🎯 ColWright Inventory System v1.8.0

A comprehensive inventory management system for ColWright.com with web-based gallery and review interface.

## 🚀 Quick Start

### Automatic Setup (Recommended)

**Windows:**
```powershell
# Run the automated setup script
npm run setup
# OR
powershell -ExecutionPolicy Bypass -File setup.ps1
# OR double-click start-server.bat
```

**Unix/Linux/macOS:**
```bash
# Run the automated setup script
npm run setup-unix
# OR
./setup.sh
```

### Manual Setup

1. **Install Node.js** (v14.0.0 or higher)
   - Download from [https://nodejs.org/](https://nodejs.org/)

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   # OR
   node server.js
   ```

4. **Access the system**
   - Gallery: http://localhost:3000
   - Review: http://localhost:3000/review.html

## 🌐 Remote Access

For remote access from other devices:

### Cloudflare Tunnel (Recommended)
```bash
# Install cloudflared
# Then run:
cloudflared tunnel --url http://localhost:3000
```

### Other Options
- **ngrok**: `npx ngrok http 3000`
- **LocalTunnel**: `npx localtunnel --port 3000`

## 📁 Project Structure

```
scrape-colwright/
├── api/
│   └── scraper.js          # Web scraping functionality
├── images/                 # Item images
├── index.html             # Main gallery interface
├── review.html            # Item review interface
├── server.js              # Express web server
├── inventory.db           # SQLite database
├── setup.ps1              # Windows setup script
├── setup.sh               # Unix setup script
├── start-server.bat       # Windows quick start
└── package.json           # Dependencies and scripts
```

## 🎮 Available Commands

```bash
npm start              # Start the web server
npm run dev            # Start in development mode
npm run setup          # Run Windows setup script
npm run setup-unix     # Run Unix setup script
npm run install-deps   # Install dependencies
npm run check-status   # Check if server is running
npm run scraper        # Run the scraper
```

## 🔧 Features

### v1.8.0 Current Features
- ✅ **Item ID Display**: Shows "Showing item: #####" in review interface
- ✅ **Review Workflow New Window**: Opens in new tab for multi-tasking
- ✅ **Version Numbering**: Version displayed in both interfaces
- ✅ **Image Zoom**: Click-to-zoom functionality in review
- ✅ **ItemID Links**: Clickable ItemID links from gallery to review
- ✅ **Enhanced Search**: Search by ItemID, description, client
- ✅ **Comments Fields**: Disposition and review comments
- ✅ **New Types/Dispositions**: Plates type, Gift disposition
- ✅ **Remote Access**: Cloudflare Tunnel integration

### Database Schema
- `item_id`: Unique item identifier
- `type`: Item category (Furniture, Art, Books, Silver, Plates, Other)
- `disposition`: Action (Sell, Donate, Gift, Toss)
- `disposition_comments`: Disposition-specific notes
- `review`: Review assignments (John, Catharine, Caroline, Colwright)
- `review_comments`: Review-specific instructions
- `description`: Item description
- `client`: Client information
- `comments`: General notes
- `image_file`: Primary image path
- `image_files`: Multiple image paths (JSON array)

## 🎯 Usage

### Gallery Interface (index.html)
- **Browse items** with search and filtering
- **Sort by columns** using arrow buttons
- **Filter by type** using checkboxes
- **Click ItemID** to open item in review interface
- **View images** with thumbnail display

### Review Interface (review.html)
- **Navigate items** with arrow buttons or keyboard
- **Set item type** with checkboxes or keyboard shortcuts
- **Set disposition** with checkboxes or keyboard shortcuts
- **Assign reviews** to team members
- **Add comments** for disposition and review
- **Zoom images** by clicking on them
- **Search items** by ItemID, description, or client

### Keyboard Shortcuts
- **Navigation**: `←` Previous, `→` Next
- **Types**: `f` Furniture, `a` Art, `b` Books, `p` Plates, `v` Silver, `o` Other
- **Dispositions**: `s` Sell, `d` Donate, `g` Gift, `t` Toss
- **Search**: `Enter` in search field
- **Image**: Click to zoom in/out

## 🔄 Version Management

The system uses semantic versioning (Major.Minor.Patch):
- **v1.8.0**: Current version with item ID display and version numbering
- **v1.9.0**: Next minor version for new features
- **v2.0.0**: Major version for significant changes

See `VERSION_HISTORY.md` for complete change log.

## 🛠️ Troubleshooting

### Common Issues

**better-sqlite3 Error:**
```bash
# Windows
Remove-Item -Recurse -Force node_modules
npm install

# Unix
rm -rf node_modules
npm install
```

**Port 3000 in Use:**
```bash
# Windows
netstat -an | findstr :3000

# Unix
lsof -i :3000
```

**Permission Denied:**
- Windows: Run PowerShell as Administrator
- Unix: Check file permissions with `ls -la setup.sh`

### Getting Help

1. Check the console output for error messages
2. Verify Node.js version: `node --version`
3. Check dependencies: `npm list`
4. Review the setup logs for specific issues

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console output for error messages
3. Ensure all dependencies are properly installed
4. Verify the database and images directory exist

---

**ColWright Inventory System v1.8.0** - Built with Node.js, Express, and SQLite