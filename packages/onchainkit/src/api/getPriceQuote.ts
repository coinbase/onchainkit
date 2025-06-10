import { RequestContext, RequestContextType } from '@/core/network/constants';
import { CDP_GET_PRICE_QUOTE } from '@/core/network/definitions/wallet';
import { sendRequest } from '@/core/network/request';

import type { GetPriceQuoteParams, GetPriceQuoteResponse } from './types';
import { buildErrorStruct } from './utils/buildErrorStruct';
import { ApiErrorCode } from './constants';

/**
 * Retrieves a price quote for a token
 *
 * @param params - The parameters for the price quote. The property `tokens`
 * must be an array of contract addresses or 'ETH'.
 * @param _context - The context in which the price quote is retrieved
 * @returns The price quote for the token
 */
export async function getPriceQuote(
  params: GetPriceQuoteParams,
  _context: RequestContextType = RequestContext.API,
): Promise<GetPriceQuoteResponse> {
  const apiParams = validateGetPriceQuoteParams(params);
  if ('error' in apiParams) {
    return apiParams;
  }

  try {
    const res = await sendRequest<GetPriceQuoteParams, GetPriceQuoteResponse>(
      CDP_GET_PRICE_QUOTE,
      [apiParams],
      _context,
    );
    if (res.error) {
      return buildErrorStruct({
        code: String(res.error.code),
        error: 'Error fetching price quote',
        message: res.error.message,
      });
    }
    return res.result;
  } catch (error) {
    return buildErrorStruct({
      code: ApiErrorCode.uncaughtPriceQuoteError,
      error: 'Something went wrong',
      message: `Error fetching price quote: ${error}`,
    });
  }
}

function validateGetPriceQuoteParams(params: GetPriceQuoteParams) {
  const { tokens } = params;

  if (!tokens || tokens.length === 0) {
    return buildErrorStruct({
      code: ApiErrorCode.InvalidInput,
      error: 'Invalid input: tokens must be an array of at least one token',
      message: 'Tokens must be an array of at least one token',
    });
  }

  return params;
}
