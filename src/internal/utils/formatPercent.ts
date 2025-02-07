/**
 * Internal
 * @param value
 * @param decimals
 * @returns
 */
export function formatPercent(value: number, decimals = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
