import { GetSwapQuote } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import { GetQuoteResponse, GetQuoteParams, GetQuoteAPIParams, Quote, SwapError } from '../types';

/**
 * Retrieves a quote for a swap from Token A to Token B.
 */
export async function getQuote(params: GetQuoteParams): Promise<GetQuoteResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
  };

  params = { ...defaultParams, ...params };

  // Only pass in the address as a parameter to the request
  const addressParams: GetQuoteAPIParams = {
    from: params.from.address,
    to: params.to.address,
    amount: params.amount,
    amountReference: params.amountReference,
  };

  try {
    const res = await sendRequest<GetQuoteAPIParams, Quote>(GetSwapQuote, [addressParams]);

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
