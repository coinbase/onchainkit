import type { SwapUnit } from '../../swap/types';
import { isSwapError } from '../../swap/utils/isSwapError';
import { Token } from '../../token';
import { formatTokenAmount } from '../utils/formatTokenAmount';
import { getSwapQuote } from './getSwapQuote';
import type {
  APIError,
  GetSwapQuoteParams,
  GetSwapQuoteResponse,
} from './types';

type GetSwapLiteQuoteResponse = {
  response?: GetSwapQuoteResponse;
  error?: APIError;
  formattedFromAmount?: string;
};

type GetSwapLiteQuoteParams = Omit<GetSwapQuoteParams, 'from'> & {
  fromSwapUnit: SwapUnit;
  from?: Token;
};

export async function getSwapLiteQuote({
  amount,
  amountReference,
  from,
  maxSlippage,
  to,
  useAggregator,
  fromSwapUnit,
}: GetSwapLiteQuoteParams): Promise<GetSwapLiteQuoteResponse> {
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
    formattedFromAmount = formatTokenAmount(
      response.fromAmount,
      response.from.decimals,
    );

    fromSwapUnit.setAmountUSD(response?.fromAmountUSD || '');
    fromSwapUnit.setAmount(formattedFromAmount || '');
  }

  let error;
  if (isSwapError(response)) {
    error = response;
    response = undefined;
  }

  return { response, formattedFromAmount, error };
}
