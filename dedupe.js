import Database from 'better-sqlite3';

const db = new Database('inventory.db');
db.exec(`
  DELETE FROM items
  WHERE id NOT IN (
    SELECT MIN(id)
    FROM items
    GROUP BY item_id
  );
`);
db.close();

console.log("Duplicate records (by ItemID) deleted!");
