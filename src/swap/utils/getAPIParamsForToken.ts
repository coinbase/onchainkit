import type {
  BuildSwapTransactionParams,
  GetAPIParamsForToken,
  SwapAPIParams,
  SwapError,
} from '../types';
import { formatDecimals } from './formatDecimals';

/**
 * Converts parameters with `Token` to ones with address.
 *
 * Additionally adds default values for optional request fields.
 */
export function getAPIParamsForToken(
  params: GetAPIParamsForToken,
): SwapAPIParams | SwapError {
  const { from, to, amount, amountReference, isAmountInDecimals } = params;
  const { fromAddress } = params as BuildSwapTransactionParams;
  const decimals = amountReference === 'from' ? from.decimals : to.decimals;
  const amountOrError = isAmountInDecimals
    ? amount
    : formatDecimals(amount, false, decimals);

  if ((amountOrError as SwapError).error) {
    return amountOrError as SwapError;
  }

  return {
    fromAddress: fromAddress,
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: amountOrError as string,
    amountReference: amountReference || 'from',
  };
}
