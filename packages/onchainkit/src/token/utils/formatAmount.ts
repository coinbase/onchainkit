import type { FormatAmountOptions, FormatAmountResponse } from '../types';

/**
 * Formats a numeric string into a localized string representation with optional
 * control over the number of decimal places.
 */
export function formatAmount(
  amount: string | undefined,
  options: FormatAmountOptions = {},
): FormatAmountResponse {
  if (amount === undefined) {
    return '';
  }

  const { locale, minimumFractionDigits, maximumFractionDigits } = options;

  return Number(amount).toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
