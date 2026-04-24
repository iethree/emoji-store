const { calculateTotal, applyBulkDiscount, formatMoney } = require('../src/pricing');

describe('calculateTotal', () => {
  test('sums items with quantities', () => {
    const items = [
      { price_cents: 100, quantity: 2 },
      { price_cents: 250, quantity: 1 },
    ];
    expect(calculateTotal(items)).toBe(450);
  });

  test('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});

describe('applyBulkDiscount', () => {
  test('no discount under 5 items', () => {
    expect(applyBulkDiscount(1000, 3)).toBe(1000);
  });

  test('5% discount at 5 items', () => {
    expect(applyBulkDiscount(1000, 5)).toBe(950);
  });

  test('10% discount at 10 items', () => {
    expect(applyBulkDiscount(1000, 10)).toBe(900);
  });
});

describe('formatMoney', () => {
  test('formats cents as dollars', () => {
    expect(formatMoney(1234)).toBe('$12.34');
  });
});
