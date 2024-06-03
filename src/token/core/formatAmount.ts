import type { FormatAmountOptions, FormatAmountResponse } from '../types';

/**
 * Retrieves a list of tokens on Base.
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
