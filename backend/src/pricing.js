function calculateTotal(items) {
  if (!Array.isArray(items)) return 0;
  let total = 0;
  for (const item of items) {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price_cents) || 0;
    total += qty * price;
  }
  return total;
}

function applyBulkDiscount(total, itemCount) {
  if (itemCount >= 10) return Math.floor(total * 0.9);
  if (itemCount >= 5) return Math.floor(total * 0.95);
  return total;
}

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

module.exports = { calculateTotal, applyBulkDiscount, formatMoney };
