import type { Address } from 'viem';
import type { Token } from '../token/types';

export type AddressOrETH = Address | 'ETH';

/**
 * Note: exported as public Type
 */
export type Fee = {
  amount: string; // The amount of the fee
  baseAsset: Token; // The base asset for the fee
  percentage: string; // The percentage of the fee
};

export type GetQuoteAPIParams = {
  from: AddressOrETH | ''; // The source address or 'ETH' for Ethereum
  to: AddressOrETH | ''; // The destination address or 'ETH' for Ethereum
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
};

/**
 * Note: exported as public Type
 */
export type GetQuoteParams = {
  from: Token; // The source token for the swap
  to: Token; // The destination token for the swap
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
  isAmountInDecimals?: boolean; // Whether the amount is in decimals
};

/**
 * Note: exported as public Type
 */
export type GetQuoteResponse = Quote | SwapError;

/**
 * Note: exported as public Type
 */
export type Quote = {
  amountReference: string; // The reference amount for the quote
  from: Token; // The source token for the swap
  fromAmount: string; // The amount of the source token
  hasHighPriceImpact: boolean; // Whether the price impact is high
  priceImpact: string; // The price impact of the swap
  slippage: string; // The slippage of the swap
  to: Token; // The destination token for the swap
  toAmount: string; // The amount of the destination token
  warning?: QuoteWarning; // The warning associated with the quote
};

/**
 * Note: exported as public Type
 */
export type QuoteWarning = {
  description?: string; // The description of the warning
  message?: string; // The message of the warning
  type?: string; // The type of the warning
};

/**
 * Note: exported as public Type
 */
export type SwapError = {
  code: number; // The error code
  error: string; // The error message
};

export type Trade = {
  approveTx?: Transaction; // The approval transaction
  chainId: string; // The chain ID
  fee: Fee; // The fee for the trade
  tx: Transaction; // The trade transaction
};

export type Transaction = {
  data: string; // The transaction data
  from: string; // The sender address
  gas: string; // The gas limit
  gasPrice: string; // The gas price
  to: string; // The recipient address
  value: string; // The value of the transaction
};

export type SwapAmountInputReact = {
  amount?: string; // Token amount
  disabled?: boolean; // Whether the input is disabled
  displayMaxButton?: boolean; // Whether the max button is displayed
  label: string; // Descriptive label for the input field
  setAmount?: (amount: string) => void; // Callback function when the amount changes
  setToken: () => void; // Callback function when the token selector is clicked
  swappableTokens: Token[]; // Tokens available for swap
  token?: Token; // Selected token
  tokenBalance?: string; // Amount of selected token user owns
};
