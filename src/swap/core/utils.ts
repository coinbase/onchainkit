import type { GetQuoteParams, GetQuoteAPIParams } from '../types';

export function getParamsForToken(params: GetQuoteParams): GetQuoteAPIParams {
  const { from, to, amount, amountReference } = params;
  return {
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: amount,
    amountReference: amountReference,
  };
}
