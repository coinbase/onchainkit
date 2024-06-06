import { GetSwapQuote } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import { formatToken } from '../../token/core/formatToken';
import {
  GetQuoteResponse,
  GetQuoteParams,
  GetQuoteParamsWithAddress,
  Quote,
  SwapError,
  LegacyQuote,
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
    const res = await sendRequest<GetQuoteParamsWithAddress, LegacyQuote>(GetSwapQuote, [
      addressParams,
    ]);

    if (res.error) {
      return {
        code: res.error.code,
        error: res.error.message,
      } as SwapError;
    }

    const quote: Quote = {
      amountReference: res.result.amountReference,
      from: formatToken(res.result.fromAsset),
      fromAmount: res.result.fromAmount,
      highPriceImpact: res.result.highPriceImpact,
      priceImpact: res.result.priceImpact,
      slippage: res.result.slippage,
      to: formatToken(res.result.toAsset),
      toAmount: res.result.toAmount,
      warning: res.result.warning,
    };

    return quote;
  } catch (error) {
    throw new Error(`getQuote: ${error}`);
  }
}
