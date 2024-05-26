import { ListSwapAssets } from '../definitions/swap';
import { Token, ListSwapAssetsOptions, ListSwapAssetsError } from './types';
import { sendRequest } from '../queries/request';

/**
 * Retrieves a list of tokens on Base.
 * 
 * @param {ListSwapAssetsOptions} options - An optional object that can be used to filter the list of tokens.
 *  options.limit - The maximum number of tokens to return (default: 50).
 *  options.search - A string to search for in the token name or symbol.
 *  options.page - The page number to return (default: 1).
 * @returns A promise that resolves to an array of `Token` objects.
 * @throws Will throw an error if the request to the RPC URL fails.
 * @example
import { getTokens } from '@coinbase/onchainkit'

const tokens = await getTokens();
*/
export async function getTokens(options?: ListSwapAssetsOptions): Promise<Token[]> {
  // Default filter values
  const defaultFilter: ListSwapAssetsOptions = {
    limit: 50,
    page: 1,
  };

  const filters = [{ ...defaultFilter, ...options }];

  const res = await sendRequest<ListSwapAssetsOptions, Token[]>(ListSwapAssets, filters);
  if (res.error) {
    throw new Error(`getTokens: ${res.error.message}`);
  }
  return res.result;
}
