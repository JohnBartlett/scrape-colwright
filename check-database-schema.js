import Database from "better-sqlite3";

const db = new Database("inventory.db");

console.log("🔍 Checking Database Schema...\n");

// Get table info
const tableInfo = db.prepare("PRAGMA table_info(items)").all();
console.log("📋 Current table columns:");
tableInfo.forEach(col => {
  console.log(`  - ${col.name} (${col.type})`);
});

// Check for required fields
const requiredFields = [
  'id', 'item_id', 'description', 'client', 'image_url', 'image_file',
  'comments', 'type', 'disposition', 'disposition_comments', 'review'
];

console.log("\n✅ Checking required fields:");
requiredFields.forEach(field => {
  const exists = tableInfo.some(col => col.name === field);
  console.log(`  ${exists ? '✅' : '❌'} ${field}`);
});

// Check if any fields are missing
const missingFields = requiredFields.filter(field => 
  !tableInfo.some(col => col.name === field)
);

if (missingFields.length > 0) {
  console.log(`\n❌ Missing fields: ${missingFields.join(', ')}`);
} else {
  console.log("\n✅ All required fields are present!");
}

// Check sample data to see what's actually being stored
console.log("\n📊 Sample data check:");
const sampleItem = db.prepare("SELECT * FROM items LIMIT 1").get();
if (sampleItem) {
  console.log("Sample item fields:");
  Object.keys(sampleItem).forEach(key => {
    console.log(`  ${key}: ${sampleItem[key] || '(empty)'}`);
  });
} else {
  console.log("No items found in database");
}

db.close(); 