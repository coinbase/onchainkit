/**

 * Internal
 * This function should be used in place of our existing `getRoundedAmount`
 * It's built on Intl.NumberFormat which is more reliable than our existing method
 * Also allows us to specify the locale in the future if we want to support i18n
 * @param balance - The balance to round
 * @param fractionDigits - The number of fraction digits to round to
 * @returns The rounded balance
 */
export function getRoundedAmount(balance: string, fractionDigits: number) {
  if (balance === '0') {
    return balance;
  }

  const num = Number(balance);
  const hasDecimals = num % 1 !== 0;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: hasDecimals
      ? Math.min(fractionDigits, balance.split('.')[1]?.length || 0)
      : 0,
  });

  return formatter.format(num);
}
