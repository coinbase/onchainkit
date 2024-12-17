import { getSwapQuote } from '@/core/api/getSwapQuote';
import type {
  APIError,
  GetSwapQuoteParams,
  GetSwapQuoteResponse,
} from '@/core/api/types';
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
  amountReference,
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
    response = await getSwapQuote({
      amount,
      amountReference,
      from,
      maxSlippage,
      to,
      useAggregator,
    });
  }

  let formattedFromAmount = '';
  if (response && !isSwapError(response)) {
    formattedFromAmount = response?.fromAmount
      ? formatTokenAmount(response.fromAmount, response.from.decimals)
      : '';

    fromSwapUnit?.setAmountUSD(response?.fromAmountUSD || '');
    fromSwapUnit?.setAmount(formattedFromAmount || '');
  }

  let error: SwapError | undefined;
  if (isSwapError(response)) {
    error = response;
    response = undefined;
  }

  return { response, formattedFromAmount, error };
}
