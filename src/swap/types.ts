import { Address } from 'viem';
import { Token } from '../token/types';

export type AddressOrETH = Address | 'ETH';

/**
 * Note: exported as public Type
 */
export type Fee = {
  amount: string;
  baseAsset: Token;
  percentage: string;
};

export type GetQuoteAPIParams = {
  from: AddressOrETH | '';
  to: AddressOrETH | '';
  amount: string;
  amountReference?: string;
};

/**
 * Note: exported as public Type
 */
export type GetQuoteParams = {
  from: Token;
  to: Token;
  amount: string;
  amountReference?: string;
  amountInDecimals?: boolean;
};

/**
 * Note: exported as public Type
 */
export type GetQuoteResponse = Quote | SwapError;

/**
 * Note: exported as public Type
 */
export type Quote = {
  amountReference: string;
  from: Token;
  fromAmount: string;
  highPriceImpact: boolean;
  priceImpact: string;
  slippage: string;
  to: Token;
  toAmount: string;
  warning?: QuoteWarning;
};

/**
 * Note: exported as public Type
 */
export type QuoteWarning = {
  description?: string;
  message?: string;
  type?: string;
};

/**
 * Note: exported as public Type
 */
export type SwapError = {
  code: number;
  error: string;
};

export type Trade = {
  approveTx?: Transaction;
  chainId: string;
  fee: Fee;
  tx: Transaction;
};

export type Transaction = {
  data: string;
  from: string;
  gas: string;
  gasPrice: string;
  to: string;
  value: string;
};
