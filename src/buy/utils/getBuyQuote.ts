import { getSwapQuote } from '@/api/getSwapQuote';
import type { GetSwapQuoteParams, GetSwapQuoteResponse } from '@/api/types';
import { formatTokenAmount } from '@/core/utils/formatTokenAmount';
import type { SwapError, SwapUnit } from '../../swap/types';
import { isSwapError } from '../../swap/utils/isSwapError';
import type { Token } from '../../token';
import type { GetBuyQuoteResponse } from '../types';

type GetBuyQuoteParams = Omit<GetSwapQuoteParams, 'from'> & {
  fromSwapUnit?: SwapUnit;
  from?: Token;
};

/**
 * Fetches a quote for a swap, but only if the from and to tokens are different.
 */

export async function getBuyQuote({
  amount,
  from,
  maxSlippage,
  to,
  useAggregator,
  fromSwapUnit,
}: GetBuyQuoteParams): Promise<GetBuyQuoteResponse> {
  // only fetch quote if the from token is provided
  if (!from) {
    return { response: undefined, formattedFromAmount: '', error: undefined };
  }

  let response: GetSwapQuoteResponse | undefined;
  // only fetch quote if the from and to tokens are different
  if (to?.symbol !== from?.symbol) {
    // we are trying to swap from the token we are buying "to" the token we are selling
    // instead of using amountRefence: 'to', we can use amountRefence: 'from'
    // and then swap to and from to get the quote
    response = await getSwapQuote({
      amount,
      amountReference: 'from',
      from: to,
      maxSlippage,
      to: from,
      useAggregator,
    });
  }

  let formattedFromAmount = '';
  if (response && !isSwapError(response)) {
    formattedFromAmount = response?.toAmount
      ? formatTokenAmount(response.toAmount, response.to.decimals)
      : '';

    fromSwapUnit?.setAmountUSD(response?.toAmountUSD || '');
    fromSwapUnit?.setAmount(formattedFromAmount || '');
  }

  let error: SwapError | undefined;
  if (isSwapError(response)) {
    error = response;
    response = undefined;
  }

  return { response, formattedFromAmount, error };
}
