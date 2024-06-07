import type { GetQuoteParams, GetQuoteAPIParams } from '../types';

export function getParamsForToken(params: GetQuoteParams): GetQuoteAPIParams {
  const { from, to, amount, amountReference } = params;
  return {
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: amount,
    amountReference: amountReference || 'from',
  };
}

/**
 * Formats an amount according to the decimals. Defaults to 18 decimals for ERC-20s.
 */
export function formatDecimals(
  amount: string,
  inputInDecimals: boolean = true,
  decimals: number = 18,
): string {
  if (inputInDecimals) {
    return (Number(amount) / 10 ** decimals).toString();
  }
  return (Number(amount) * 10 ** decimals).toString();
}
