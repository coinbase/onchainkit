import { CDP_GETSWAPQUOTE } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import type { GetQuoteResponse, GetQuoteParams, Quote, SwapError, SwapAPIParams } from '../types';
import { getParamsForToken } from './getParamsForToken';

/**
 * Retrieves a quote for a swap from Token A to Token B.
 */
export async function getQuote(params: GetQuoteParams): Promise<GetQuoteResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
    isAmountInDecimals: false,
  };

  const apiParams = getParamsForToken({ ...defaultParams, ...params });

  try {
    const res = await sendRequest<SwapAPIParams, Quote>(CDP_GETSWAPQUOTE, [apiParams]);

    if (res.error) {
      return {
        code: res.error.code,
        error: res.error.message,
      } as SwapError;
    }

    return res.result;
  } catch (error) {
    throw new Error(`getQuote: ${error}`);
  }
}
