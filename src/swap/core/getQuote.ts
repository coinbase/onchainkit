import { GetSwapQuote } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import { GetQuoteResponse, GetQuoteParams, Quote, SwapError } from '../types';

/**
 * Retrieves a quote for a swap from Token A to Token B.
 */
export async function getQuote(params: GetQuoteParams): Promise<GetQuoteResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
  };

  params = { ...defaultParams, ...params };

  try {
    const res = await sendRequest<GetQuoteParams, Quote>(GetSwapQuote, [params]);

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
