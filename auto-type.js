// auto-type.js

function inferTypeFromDescription(desc) {
  if (!desc) return "";
  desc = desc.toLowerCase();
  if (desc.includes("art")) return "Art";
  if (desc.includes("furniture")) return "Furniture";
  if (desc.includes("book")) return "Books";
  if (desc.includes("silver")) return "Silver";
  if (desc.includes("plate")) return "Plates";
  // Add more rules as needed
  return "Other";
}

function autoTypeAll() {
  if (!window.items) return;
  window.items.forEach(row => {
    row.type = inferTypeFromDescription(row.description);
  });
  if (window.renderTable) window.renderTable();
}
