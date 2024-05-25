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

/**
 * Note: exported as public Type
 */
export type TokenChipReact = {
  token: Token;
};
