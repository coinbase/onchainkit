import { Address } from 'viem';
import { Token } from '../token/types';

export type AddressOrETH = Address | 'ETH';

export type Fee = {
  amount: string;
  baseAsset: Token;
  percentage: string;
};

export type Quote = {
  amountReference: string;
  fromAmount: string;
  fromAsset: Token;
  highPriceImpact: boolean;
  priceImpact: string;
  slippage: string;
  toAmount: string;
  toAsset: Token;
  warning?: QuoteWarning;
};

export type QuoteWarning = {
  description?: string;
  message?: string;
  type?: string;
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

export type TrendingToken = Token & {
  numOfBuys: number;
  numOfSells: number;
};
