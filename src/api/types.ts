import type { GetTokensError, Token } from '../token/types';

/**
 * Note: exported as public Type
 */
export type GetTokensOptions = {
  limit?: string; // The maximum number of tokens to return (default: 50)
  search?: string; // A string to search for in the token name, symbol or address
  page?: string; // The page number to return (default: 1)
};

/**
 * Note: exported as public Type
 */
export type GetTokensResponse = Token[] | GetTokensError;
