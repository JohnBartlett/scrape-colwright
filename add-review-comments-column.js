import Database from "better-sqlite3";

const db = new Database("inventory.db");

// Check if review_comments column exists
const tableInfo = db.prepare("PRAGMA table_info(items)").all();
const hasReviewComments = tableInfo.some(col => col.name === 'review_comments');

if (!hasReviewComments) {
  console.log("Adding review_comments column to items table...");
  db.prepare("ALTER TABLE items ADD COLUMN review_comments TEXT").run();
  console.log("✅ review_comments column added successfully!");
} else {
  console.log("✅ review_comments column already exists!");
}

db.close();
console.log("Database updated!"); 