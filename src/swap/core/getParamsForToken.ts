import type { GetQuoteAPIParams, GetQuoteParams } from '../types';
import { formatDecimals } from './formatDecimals';

/**
 * Converts parameters with `Token` to ones with address. Additionally adds default values for optional request fields.
 */
export function getParamsForToken(params: GetQuoteParams): GetQuoteAPIParams {
  const { from, to, amount, amountReference, isAmountInDecimals } = params;

  const decimals = amountReference == 'from' ? from.decimals : to.decimals;

  return {
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: isAmountInDecimals ? amount : formatDecimals(amount, false, decimals),
    amountReference: amountReference || 'from',
  };
}
