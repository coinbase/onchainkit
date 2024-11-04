import { formatDecimals } from '../../swap/utils/formatDecimals.js';

/**
 * Converts parameters with `Token` to ones with address.
 *
 * Additionally adds default values for optional request fields.
 */
function getAPIParamsForToken(params) {
  const from = params.from,
    to = params.to,
    amount = params.amount,
    amountReference = params.amountReference,
    isAmountInDecimals = params.isAmountInDecimals;
  const fromAddress = params.fromAddress;
  const decimals = amountReference === 'from' ? from.decimals : to.decimals;

  // Input validation
  if (typeof amount !== 'string' || amount.trim() === '') {
    return {
      code: 'INVALID_INPUT',
      error: 'Invalid input: amount must be a non-empty string',
      message: ''
    };
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    return {
      code: 'INVALID_INPUT',
      error: 'Invalid input: decimals must be a non-negative integer',
      message: ''
    };
  }
  if (!/^(?:0|[1-9]\d*|\.\d+)(?:\.\d*)?$/.test(amount)) {
    return {
      code: 'INVALID_INPUT',
      error: 'Invalid input: amount must be a non-negative number string',
      message: ''
    };
  }
  return {
    fromAddress: fromAddress,
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: isAmountInDecimals ? amount : formatDecimals(amount, false, decimals),
    amountReference: amountReference || 'from'
  };
}
export { getAPIParamsForToken };
//# sourceMappingURL=getAPIParamsForToken.js.map
