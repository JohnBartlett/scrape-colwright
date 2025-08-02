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

// Serve static files like index.html/review.html/images
app.use(express.static(__dirname));
app.use(bodyParser.json());

// API: get all inventory items
app.get("/api/items", (req, res) => {
  const rows = db.prepare("SELECT * FROM items ORDER BY item_id ASC").all();
  res.json(rows);
});

// API: update comments/type/disposition for a single item
app.post("/api/item/:id", (req, res) => {
  const { id } = req.params;
  const { comments, type, disposition, disposition_comments, review, review_comments } = req.body;
  db.prepare(
    "UPDATE items SET comments = ?, type = ?, disposition = ?, disposition_comments = ?, review = ?, review_comments = ? WHERE id = ?"
  ).run(comments || "", type || "", disposition || "", disposition_comments || "", review || "", review_comments || "", id);
  res.json({ ok: true });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Note: On hotel networks, local network access may be restricted`);
  console.log(`Use ngrok for remote access: ngrok http ${PORT}`);
});
