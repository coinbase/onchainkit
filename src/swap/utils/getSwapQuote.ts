import { CDP_GET_SWAP_QUOTE } from '../../network/definitions/swap';
import { sendRequest } from '../../network/request';
import type {
  GetSwapQuoteParams,
  GetSwapQuoteResponse,
  SwapAPIParams,
  SwapError,
  SwapQuote,
} from '../types';
import { getAPIParamsForToken } from './getAPIParamsForToken';
import { getSwapErrorCode } from './getSwapErrorCode';

/**
 * Retrieves a quote for a swap from Token A to Token B.
 */
export async function getSwapQuote(
  params: GetSwapQuoteParams,
): Promise<GetSwapQuoteResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
    isAmountInDecimals: false,
  };
  const apiParamsOrError = getAPIParamsForToken({
    ...defaultParams,
    ...params,
  });
  if ((apiParamsOrError as SwapError).error) {
    return apiParamsOrError as SwapError;
  }
  let apiParams = apiParamsOrError as SwapAPIParams;

  if (!params.useAggregator) {
    apiParams = {
      v2Enabled: true,
      ...apiParams,
    };
  }
  if (params.slippage) {
    apiParams = {
      slippagePercentage: params.slippage,
      ...apiParams,
    };
  }

  try {
    const res = await sendRequest<SwapAPIParams, SwapQuote>(
      CDP_GET_SWAP_QUOTE,
      [apiParams],
    );
    if (res.error) {
      return {
        code: getSwapErrorCode('quote', res.error?.code),
        error: res.error.message,
      } as SwapError;
    }
    return res.result;
  } catch (_error) {
    return {
      code: getSwapErrorCode('uncaught-quote'),
      error: 'Something went wrong',
    };
  }
}
