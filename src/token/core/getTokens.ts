import { ListSwapAssets } from '../../definitions/swap';
import { LegacyTokenData, GetTokensOptions, GetTokensResponse, GetTokensError } from '../types';
import { sendRequest } from '../../queries/request';
import { formatToken, formatTokens } from './formatToken';

/**
 * Retrieves a list of tokens on Base.
 */
export async function getTokens(options?: GetTokensOptions): Promise<GetTokensResponse> {
  // Default filter values
  const defaultFilter: GetTokensOptions = {
    limit: '50',
    page: '1',
  };

  const filters = { ...defaultFilter, ...options };

  try {
    const res = await sendRequest<GetTokensOptions, LegacyTokenData[]>(ListSwapAssets, [filters]);

    if (res.error) {
      return {
        code: res.error.code,
        error: res.error.message,
      } as GetTokensError;
    }

    // Map the data from the response to the `OnchainKit` Token type
    return formatTokens(res.result);
  } catch (error) {
    throw new Error(`getTokens: ${error}`);
  }
}
