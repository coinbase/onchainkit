import { GetSwapQuote } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import {
  GetQuoteResponse,
  GetQuoteParams,
  GetQuoteParamsWithAddress,
  Quote,
  SwapError,
} from '../types';

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
  // Defaults to ETH if no address is provided
  const addressParams: GetQuoteParamsWithAddress = {
    from: params.from.address || 'ETH',
    to: params.to.address || 'ETH',
    amount: params.amount,
    amountReference: params.amountReference,
  };

  try {
    const res = await sendRequest<GetQuoteParamsWithAddress, Quote>(GetSwapQuote, [addressParams]);

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
