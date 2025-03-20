import { getSwapQuote } from '@/api/getSwapQuote';
import type { GetSwapQuoteParams, GetSwapQuoteResponse } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { formatTokenAmount } from '@/internal/utils/formatTokenAmount';
import type { SwapError, SwapUnit } from '../../swap/types';
import { isSwapError } from '../../swap/utils/isSwapError';
import type { Token } from '../../token';
import type { GetBuyQuoteResponse } from '../types';

/**
 * Parameters for getting a buy quote, extending GetSwapQuoteParams but omitting 'from'
 */
type GetBuyQuoteParams = Omit<GetSwapQuoteParams, 'from'> & {
  /** Optional swap unit for the 'from' token */
  fromSwapUnit?: SwapUnit;
  /** Optional 'from' token */
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
    // switching to and from here
    // instead of getting a quote for how much of X do we need to sell to get the input token amount
    // we can get a quote for how much of X we will receive if we sell the input token amount
    response = await getSwapQuote(
      {
        amount,
        amountReference: 'from',
        from: to,
        maxSlippage,
        to: from,
        useAggregator,
      },
      RequestContext.Buy,
    );
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
