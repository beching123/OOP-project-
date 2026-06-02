/**
 * Format a number as XAF currency.
 * e.g. formatCurrency(25000) → "XAF 25,000"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return 'XAF 0';
  return `XAF ${Number(amount).toLocaleString('en-CM')}`;
}

/**
 * Format a number with discount display
 * e.g. calcDiscount(25000, 20000) → 20 (percent off)
 */
export function calcDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
