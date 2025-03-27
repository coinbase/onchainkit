/**
 * Internal
 * This function should be used in place of our existing `getRoundedAmount`
 * It's built on Intl.NumberFormat which is more reliable than our existing method
 * Also allows us to specify the locale in the future if we want to support i18n
 * @param balance - The balance to round
 * @param fractionDigits - The number of fraction digits to round to
 * @returns The rounded balance
 */
export function getTruncatedAmount(
  balance: string,
  decimalPlaces: number,
  notation: 'standard' | 'compact' = 'standard',
) {
  if (balance === '0') {
    return balance;
  }

  const num = Number(balance);
  const hasDecimals = num % 1 !== 0;
  const decimals = balance.split('.')[1]?.length || 0;

  // We have to do this because floating point precision is bad;
  // We should use roundingMode: 'trunc' once we switch build tools and can target es2023
  const truncated =
    decimals > decimalPlaces
      ? Math.trunc(num * 10 ** decimalPlaces) / 10 ** decimalPlaces
      : num;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: hasDecimals ? Math.min(decimalPlaces, decimals) : 0,
    notation,
    // TODO: implement this once we switch build tools and can target es2023
    // roundingMode: 'trunc',
  });

  return formatter.format(truncated);
}
