import { RequestContext, RequestContextType } from '@/core/network/constants';
import { CDP_LIST_SWAP_ASSETS } from '../core/network/definitions/swap';
import { sendRequest } from '../core/network/request';
import type { Token } from '../token/types';
import type { GetTokensOptions, GetTokensResponse } from './types';
import { ApiErrorCode } from './constants';
import { buildErrorStruct } from './utils/buildErrorStruct';

/**
 * Retrieves a list of tokens on Base.
 */
export async function getTokens(
  options?: GetTokensOptions,
  _context: RequestContextType = RequestContext.API,
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
      return buildErrorStruct({
        code: ApiErrorCode.AMGTa01,
        error: res.error.code.toString(),
        message: res.error.message,
      });
    }
    return res.result;
  } catch (error) {
    return buildErrorStruct({
      code: ApiErrorCode.AMGTa02,
      error: JSON.stringify(error),
      message: 'Request failed',
    });
  }
}
