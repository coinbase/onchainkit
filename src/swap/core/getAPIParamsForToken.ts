import { formatDecimals } from './formatDecimals';
import type {
  BuildSwapTransactionParams,
  GetAPIParamsForToken,
  SwapAPIParams,
} from '../types';

/**
 * Converts parameters with `Token` to ones with address.
 *
 * Additionally adds default values for optional request fields.
 */
export function getAPIParamsForToken(
  params: GetAPIParamsForToken,
): SwapAPIParams {
  const { from, to, amount, amountReference, isAmountInDecimals } = params;
  const { fromAddress } = params as BuildSwapTransactionParams;
  const decimals = amountReference === 'from' ? from.decimals : to.decimals;
  return {
    fromAddress: fromAddress,
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: isAmountInDecimals
      ? amount
      : formatDecimals(amount, false, decimals),
    amountReference: amountReference || 'from',
  };
}
