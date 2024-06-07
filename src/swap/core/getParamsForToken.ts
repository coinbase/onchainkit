import { formatDecimals } from './formatDecimals';
import type { GetQuoteParams, GetQuoteAPIParams } from '../types';

/**
 * Converts parameters with `Token` to ones with address. Additionally adds default values for optional request fields.
 */
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
