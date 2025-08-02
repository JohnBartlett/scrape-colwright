# 📋 Version History

## v1.8.0 (Current) - 2025-08-02
### ✨ New Features
- **Item ID Display**: Added "Showing item: #####" status message in review interface
- **Review Workflow New Window**: Review Workflow link now opens in new tab/window
- **Version Numbering**: Added version numbers to both gallery and review interfaces

### 🔧 Technical Changes
- Updated `show()` function to display item ID in status area
- Modified `saveCurrent()` to restore item ID display after saving
- Added version numbers to page titles
- Updated package.json version to 1.8.0

---

## v1.7.0 - 2025-08-02
### ✨ New Features
- **Image Zoom Feature**: Click-to-zoom functionality for item images in review interface
- **Enhanced Visual Feedback**: Hover effects and smooth transitions for image zoom

### 🔧 Technical Changes
- Added CSS zoom styles and transitions
- Implemented JavaScript click handlers for image zoom
- Updated keyboard cheatsheet with zoom instructions
- Auto-reset zoom state when switching items

---

## v1.6.0 - 2025-08-02
### ✨ New Features
- **ItemID Clickable Links**: ItemID column links to review.html with specific item
- **URL Parameter Handling**: Review interface automatically loads specific items
- **Enhanced Search**: ItemID is now searchable in review interface

### 🔧 Technical Changes
- Added URL parameter parsing in review.html
- Enhanced search functionality to include ItemID
- Updated search placeholder text and cheatsheet
- Improved user feedback for item loading

---

## v1.5.0 - 2025-08-02
### ✨ New Features
- **Review Comments Field**: Added dedicated comments field for review instructions
- **Enhanced Review System**: Better organization of review-related data

### 🔧 Technical Changes
- Added `review_comments` column to database
- Updated API endpoint to handle review comments
- Enhanced review interface with new comments field
- Updated save/load functionality for review comments

---

## v1.4.0 - 2025-08-02
### ✨ New Features
- **Disposition Comments**: Added text field for disposition-specific comments
- **Enhanced Disposition Tracking**: Better organization of disposition data

### 🔧 Technical Changes
- Added `disposition_comments` column to database
- Updated API endpoint to handle disposition comments
- Enhanced review interface with disposition comments field
- Updated save/load functionality for disposition comments

---

## v1.3.0 - 2025-08-02
### ✨ New Features
- **Gift Disposition**: Added "Gift" as new disposition option
- **Plates Type**: Added "Plates" as new item type category

### 🔧 Technical Changes
- Updated auto-type.js to include "Plates" detection
- Enhanced review.html with new disposition and type options
- Updated keyboard shortcuts for new options
- Added hardcoded "Plates" filter to index.html

---

## v1.2.0 - 2025-08-02
### ✨ New Features
- **Cloudflare Tunnel**: Implemented reliable remote access solution
- **Hotel Network Support**: Optimized for hotel network restrictions

### 🔧 Technical Changes
- Added cloudflared tunnel configuration
- Updated server.js for external access
- Created comprehensive remote access documentation
- Enhanced network compatibility

---

## v1.1.0 - 2025-08-02
### ✨ New Features
- **Remote Access**: Server now accessible from external devices
- **Network Interface Binding**: Server listens on all network interfaces

### 🔧 Technical Changes
- Modified server.js to bind to 0.0.0.0
- Added network access documentation
- Created remote access scripts and guides
- Enhanced server startup messages

---

## v1.0.0 - 2025-08-02
### ✨ Initial Release
- **Inventory Gallery**: Complete item browsing and filtering system
- **Review Interface**: Item review and categorization workflow
- **Database Integration**: SQLite database with full CRUD operations
- **Image Management**: Image display and thumbnail system
- **Search & Filter**: Advanced search and type filtering capabilities
- **API Endpoints**: RESTful API for data management
- **Responsive Design**: Mobile-friendly interface design

### 🔧 Technical Foundation
- Express.js server with static file serving
- SQLite database with better-sqlite3
- Frontend with vanilla JavaScript
- CSS3 with responsive design
- Image handling and optimization
- Keyboard shortcuts and accessibility features

---

## 📝 Version Numbering Convention
- **Major.Minor.Patch** format
- **Major**: Significant feature additions or breaking changes
- **Minor**: New features or enhancements
- **Patch**: Bug fixes and minor improvements

## 🔄 Update Process
1. Make code changes
2. Update version number in:
   - `package.json`
   - `index.html` (title)
   - `review.html` (title)
   - `VERSION_HISTORY.md` (add new entry)
3. Document changes in version history
4. Test functionality
5. Deploy updates 