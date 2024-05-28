import type { FormatAmountOptions } from '../types';

/**
 * Retrieves a list of tokens on Base.
 */
export function formatAmount(amount: string, options: FormatAmountOptions = {}) {
  const { locale, minimumFractionDigits, maximumFractionDigits } = options;

  return Number(amount).toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
