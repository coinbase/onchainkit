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
  params: GetAPIParamsForToken
): SwapAPIParams | SwapError {
  const { from, to, amount, amountReference, isAmountInDecimals } = params;
  const { fromAddress } = params as BuildSwapTransactionParams;
  const decimals = amountReference === 'from' ? from.decimals : to.decimals;

  // Input validation
  if (typeof amount !== 'string' || amount.trim() === '') {
    return {
      code: 'INVALID_INPUT',
      error: 'Invalid input: amount must be a non-empty string',
    };
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    return {
      code: 'INVALID_INPUT',
      error: 'Invalid input: decimals must be a non-negative integer',
    };
  }
  if (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(amount)) {
    return {
      code: 'INVALID_INPUT',
      error: 'Invalid input: amount must be a non-negative number string',
    };
  }

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
