import Database from "better-sqlite3";

const db = new Database("inventory.db");

console.log("🧪 Testing API Storage...\n");

// Get a sample item to test with
const sampleItem = db.prepare("SELECT * FROM items LIMIT 1").get();

if (!sampleItem) {
  console.log("❌ No items found in database to test with");
  db.close();
  process.exit(1);
}

console.log(`📋 Testing with item ID: ${sampleItem.id}`);
console.log(`Current values:`);
console.log(`  - comments: "${sampleItem.comments || '(empty)'}"`);
console.log(`  - type: "${sampleItem.type || '(empty)'}"`);
console.log(`  - disposition: "${sampleItem.disposition || '(empty)'}"`);
console.log(`  - disposition_comments: "${sampleItem.disposition_comments || '(empty)'}"`);
console.log(`  - review: "${sampleItem.review || '(empty)'}"`);

// Test updating the item with all fields
const testData = {
  comments: "Test comment from API",
  type: "Test Type",
  disposition: "Test Disposition", 
  disposition_comments: "Test disposition comment",
  review: "Test Review"
};

console.log("\n🔄 Updating item with test data...");

try {
  const result = db.prepare(
    "UPDATE items SET comments = ?, type = ?, disposition = ?, disposition_comments = ?, review = ? WHERE id = ?"
  ).run(
    testData.comments,
    testData.type, 
    testData.disposition,
    testData.disposition_comments,
    testData.review,
    sampleItem.id
  );

  console.log(`✅ Update completed. Rows affected: ${result.changes}`);

  // Verify the update worked
  const updatedItem = db.prepare("SELECT * FROM items WHERE id = ?").get(sampleItem.id);
  
  console.log("\n📊 Verification - Updated values:");
  console.log(`  - comments: "${updatedItem.comments}"`);
  console.log(`  - type: "${updatedItem.type}"`);
  console.log(`  - disposition: "${updatedItem.disposition}"`);
  console.log(`  - disposition_comments: "${updatedItem.disposition_comments}"`);
  console.log(`  - review: "${updatedItem.review}"`);

  // Check if all fields were stored correctly
  const allCorrect = 
    updatedItem.comments === testData.comments &&
    updatedItem.type === testData.type &&
    updatedItem.disposition === testData.disposition &&
    updatedItem.disposition_comments === testData.disposition_comments &&
    updatedItem.review === testData.review;

  if (allCorrect) {
    console.log("\n✅ All fields stored correctly!");
  } else {
    console.log("\n❌ Some fields were not stored correctly!");
  }

  // Reset the item to original values
  console.log("\n🔄 Resetting item to original values...");
  db.prepare(
    "UPDATE items SET comments = ?, type = ?, disposition = ?, disposition_comments = ?, review = ? WHERE id = ?"
  ).run(
    sampleItem.comments || "",
    sampleItem.type || "",
    sampleItem.disposition || "",
    sampleItem.disposition_comments || "",
    sampleItem.review || "",
    sampleItem.id
  );
  console.log("✅ Item reset to original values");

} catch (error) {
  console.error("❌ Error during test:", error.message);
}

db.close(); 