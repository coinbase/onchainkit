import type { Token } from '../../token';
import type { GetQuoteAPIParams } from '../types';

export function getParamsForToken(
  from: Token,
  to: Token,
  amount: string,
  amountReference: string = 'from',
): GetQuoteAPIParams {
  return {
    from: from.address || 'ETH',
    to: to.address || 'ETH',
    amount: amount,
    amountReference: amountReference,
  };
}
