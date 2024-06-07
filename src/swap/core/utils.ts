import type { GetQuoteParams, GetQuoteAPIParams } from '../types';

export function getParamsForToken(params: GetQuoteParams): GetQuoteAPIParams {
  const { from, to, amount, amountReference, amountInDecimals } = params;

  const decimals = amountReference == 'from' ? from.decimals : to.decimals;

  return {
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: amountInDecimals ? amount : formatDecimals(amount, false, decimals),
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
