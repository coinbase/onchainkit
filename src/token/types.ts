// 🌲☀️🌲
import { Address } from 'viem';

/**
 * Note: exported as public Type
 */
export type Token = {
  address: Address; // The address of the token contract
  chainId: number; // The chain id of the token contract
  decimals: number; // The number of token decimals
  image: string | null; // A string url of the token logo
  name: string;
  symbol: string; // A ticker symbol or shorthand, up to 11 characters
};

// The raw response from the Swap API
export type RawTokenData = {
  name: string;
  address: Address;
  currencyCode: string;
  decimals: number;
  imageURL: string;
  blockchain: string;
  aggregators: string[];
  swappable: boolean;
  unverified: boolean;
  chainId: number;
};

/**
 * Note: exported as public Type
 */
export type TokenChipReact = {
  token: Token;
};

/**
 * Note: exported as public Type
 */
export type GetTokensOptions = {
  limit?: string;
  search?: string;
  page?: string;
};

/**
 * Note: exported as public Type
 */
export type GetTokensError = {
  code: number;
  error: string;
};

/**
 * Note: exported as public Type
 */
export type GetTokensResponse = Token[] | GetTokensError;
