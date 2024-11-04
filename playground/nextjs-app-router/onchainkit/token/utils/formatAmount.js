/**
 * Retrieves a list of tokens on Base.
 */
function formatAmount(amount, options = {}) {
  if (amount === undefined) {
    return '';
  }
  const locale = options.locale,
    minimumFractionDigits = options.minimumFractionDigits,
    maximumFractionDigits = options.maximumFractionDigits;
  return Number(amount).toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits
  });
}
export { formatAmount };
//# sourceMappingURL=formatAmount.js.map
