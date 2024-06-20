import { CDP_GET_SWAP_QUOTE } from '../../network/definitions/swap';
import { sendRequest } from '../../network/request';
import { getAPIParamsForToken } from './getAPIParamsForToken';
import { getSwapErrorCode } from './getSwapErrorCode';
import type {
  GetSwapQuoteResponse,
  SwapQuote,
  SwapError,
  GetSwapQuoteParams,
  SwapAPIParams,
} from '../types';

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
  const apiParams = getAPIParamsForToken({ ...defaultParams, ...params });

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
  } catch (error) {
    return {
      code: getSwapErrorCode('uncaught-quote'),
      error: 'Something went wrong',
    };
  }
}
