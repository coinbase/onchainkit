/**
 * Formats a fiat amount to a string with 2 decimal places.
 * @param amount - The amount to format.
 * @param currency - The currency to format the amount in.
 * @param locale - The locale to format the amount in. Defaults to the browser's locale.
 * @returns The formatted amount.
 */
export const formatFiatAmount = ({
  amount,
  currency = 'USD',
  locale,
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
}: {
  amount: number | string;
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}) => {
  let parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount)) {
    parsedAmount = 0;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(parsedAmount);
};
