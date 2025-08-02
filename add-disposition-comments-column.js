import Database from "better-sqlite3";

const db = new Database("inventory.db");

// Check if disposition_comments column exists
const tableInfo = db.prepare("PRAGMA table_info(items)").all();
const hasDispositionComments = tableInfo.some(col => col.name === 'disposition_comments');

if (!hasDispositionComments) {
  console.log("Adding disposition_comments column to items table...");
  db.prepare("ALTER TABLE items ADD COLUMN disposition_comments TEXT").run();
  console.log("✅ disposition_comments column added successfully!");
} else {
  console.log("✅ disposition_comments column already exists!");
}

db.close();
console.log("Database updated!"); 