/**
 * Internal
 * This function should be used in place of our existing `getRoundedAmount`
 * It's built on Intl.NumberFormat which is more reliable than our existing method
 * Also allows us to specify the locale in the future if we want to support i18n
 * @param balance - The balance to round
 * @param fractionDigits - The number of fraction digits to round to
 * @returns The rounded balance
 */
export function getTruncatedAmount(balance: string, decimalPlaces: number) {
  if (balance === '0') {
    return balance;
  }

  const num = Number(balance);
  const hasDecimals = num % 1 !== 0;
  const decimals = balance.split('.')[1]?.length || 0;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    // @ts-expect-error - browsers support this, unfortunately we can't update our target to es2023 because packemon doesn't support it
    roundingMode: 'trunc',
    minimumFractionDigits: 0,
    maximumFractionDigits: hasDecimals ? Math.min(decimalPlaces, decimals) : 0,
  });

  return formatter.format(num);
}
