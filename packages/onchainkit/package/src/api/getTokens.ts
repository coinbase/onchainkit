import { RequestContext } from '@/core/network/constants';
import { CDP_LIST_SWAP_ASSETS } from '../core/network/definitions/swap';
import { sendRequest } from '../core/network/request';
import type { Token } from '../token/types';
import type { GetTokensOptions, GetTokensResponse } from './types';

/**
 * Retrieves a list of tokens on Base.
 */
export async function getTokens(
  options?: GetTokensOptions,
  _context: RequestContext = RequestContext.API,
): Promise<GetTokensResponse> {
  // Default filter values
  const defaultFilter: GetTokensOptions = {
    limit: '50',
    page: '1',
  };
  const filters = { ...defaultFilter, ...options };

  try {
    const res = await sendRequest<GetTokensOptions, Token[]>(
      CDP_LIST_SWAP_ASSETS,
      [filters],
      _context,
    );
    if (res.error) {
      return {
        code: 'AmGTa01',
        error: res.error.code.toString(),
        message: res.error.message,
      };
    }
    return res.result;
  } catch (error) {
    return {
      code: 'AmGTa02', // Api module Get Tokens api Error O2
      error: JSON.stringify(error),
      message: 'Request failed',
    };
  }
}
