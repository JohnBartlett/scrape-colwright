import express from "express";
import bodyParser from "body-parser";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Database("inventory.db");
const PORT = process.env.PORT || 3000;

// Security: Only allow localhost access by default
// Change '127.0.0.1' to '0.0.0.0' if you need remote network access
const HOST = process.env.HOST || '127.0.0.1';

// Initialize database with new fields for role-based features
db.exec(`
  ALTER TABLE items ADD COLUMN interested_parties TEXT DEFAULT '[]';
  ALTER TABLE items ADD COLUMN appraisal_value REAL DEFAULT NULL;
  ALTER TABLE items ADD COLUMN appraiser_notes TEXT DEFAULT '';
  ALTER TABLE items ADD COLUMN appraiser_user TEXT DEFAULT '';
`).run();

// Serve static files like index.html/review.html/images
app.use(express.static(__dirname));
app.use(bodyParser.json());

// API: get all inventory items
app.get("/api/items", (req, res) => {
  const rows = db.prepare("SELECT * FROM items ORDER BY item_id ASC").all();
  res.json(rows);
});

// API: update comments/type/disposition/person for a single item
app.post("/api/item/:id", (req, res) => {
  const { id } = req.params;
  const { comments, type, disposition, person, disposition_comments, review, review_comments } = req.body;
  db.prepare(
    "UPDATE items SET comments = ?, type = ?, disposition = ?, person = ?, disposition_comments = ?, review = ?, review_comments = ? WHERE id = ?"
  ).run(comments || "", type || "", disposition || "", person || "", disposition_comments || "", review || "", review_comments || "", id);
  res.json({ ok: true });
});

// API: mark item as interested (for buyers)
app.post("/api/item/:id/interest", (req, res) => {
  const { id } = req.params;
  const { username, interested, note } = req.body;
  
  try {
    const item = db.prepare("SELECT interested_parties FROM items WHERE id = ?").get(id);
    let interestedParties = [];
    
    if (item && item.interested_parties) {
      try {
        interestedParties = JSON.parse(item.interested_parties);
      } catch (e) {
        interestedParties = [];
      }
    }
    
    if (interested) {
      // Add or update interest
      const existingIndex = interestedParties.findIndex(p => p.username === username);
      if (existingIndex >= 0) {
        interestedParties[existingIndex] = { username, note: note || '', timestamp: new Date().toISOString() };
      } else {
        interestedParties.push({ username, note: note || '', timestamp: new Date().toISOString() });
      }
    } else {
      // Remove interest
      interestedParties = interestedParties.filter(p => p.username !== username);
    }
    
    db.prepare("UPDATE items SET interested_parties = ? WHERE id = ?").run(JSON.stringify(interestedParties), id);
    res.json({ ok: true, interestedParties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: set appraisal value and notes (for appraisers)
app.post("/api/item/:id/appraisal", (req, res) => {
  const { id } = req.params;
  const { username, value, notes } = req.body;
  
  try {
    db.prepare("UPDATE items SET appraisal_value = ?, appraiser_notes = ?, appraiser_user = ? WHERE id = ?").run(
      value || null, 
      notes || '', 
      username || '', 
      id
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: get items by interested party
app.get("/api/items/interested/:username", (req, res) => {
  const { username } = req.params;
  
  try {
    const rows = db.prepare("SELECT * FROM items WHERE interested_parties LIKE ? ORDER BY item_id ASC").all(`%${username}%`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  if (HOST === '0.0.0.0') {
    console.log(`Server also accessible at http://[your-ip]:${PORT}`);
    console.log(`⚠️  WARNING: Server is accessible to others on the network`);
  } else {
    console.log(`🔒 Server restricted to localhost only`);
  }
  console.log(`Note: On hotel networks, local network access may be restricted`);
  console.log(`Use ngrok for remote access: ngrok http ${PORT}`);
});
