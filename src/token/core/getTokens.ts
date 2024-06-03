import { ListSwapAssets } from '../../definitions/swap';
import { LegacyTokenData, GetTokensOptions, GetTokensResponse, GetTokensError } from '../types';
import { sendRequest } from '../../queries/request';

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
    return res.result.map((token) => ({
      address: token.address,
      chainId: token.chainId,
      decimals: token.decimals,
      image: token.imageURL,
      name: token.name,
      symbol: token.currencyCode,
    }));
  } catch (error) {
    throw new Error(`getTokens: ${error}`);
  }
}
