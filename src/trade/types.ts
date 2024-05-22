import { Address } from 'viem';

/**
 * Note: exported as public Type
 */
export type Token = {
  address: Address;
  decimals?: number;
  name?: string;
  logoURI?: string;
  currencyCode?: string;
};

/**
 * Note: exported as public Type
 */
export type TrendingToken = Token & {
  numOfBuys: number;
  numOfSells: number;
};

/**
 * Note: exported as public Type
 */
export type QuoteWarning = {
  Type?: string;
  Message?: string;
  Description?: string;
};

/**
 * Note: exported as public Type
 */
export type Quote = {
  fromAsset: Token;
  toAsset: Token;
  fromAmount: string;
  toAmount: string;
  amountReference: string;
  priceImpact: string;
  highPriceImpact: boolean;
  slippage: string;
  warning?: QuoteWarning;
};

/**
 * Note: exported as public Type
 */
export type Trade = {
  tx: Transaction;
  fee: Fee;
  approveTx?: Transaction;
  chainId: string;
};

/**
 * Note: exported as public Type
 */
export type Transaction = {
  data: string;
  gas: string;
  gasPrice: string;
  from: string;
  to: string;
  value: string;
};

/**
 * Note: exported as public Type
 */
export type Fee = {
  baseAsset: Token;
  percentage: string;
  amount: string;
};

/**
 * Note: exported as public Type
 */
export type AddressOrETH = Address | 'ETH';
