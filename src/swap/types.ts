import type { Account, Address, Hex } from 'viem';
import type { Token } from '../token/types';
import { ReactNode } from 'react';

export type AddressOrETH = Address | 'ETH';

export type BuildSwapTransaction = {
  approveTransaction?: SwapTransaction; // The approval transaction
  fee: Fee; // The fee for the swap
  quote: Quote; // The quote for the swap
  transaction: SwapTransaction; // The swap transaction
  warning?: QuoteWarning; // The warning associated with the swap
};

/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionResponse = BuildSwapTransaction | SwapError;

/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionParams = GetSwapQuoteParams & {
  fromAddress: Address; // The address of the user
};

export type Fee = {
  amount: string; // The amount of the fee
  baseAsset: Token; // The base asset for the fee
  percentage: string; // The percentage of the fee
};

export type GetAPIParamsForToken = GetSwapQuoteParams | BuildSwapTransactionParams;

export type GetQuoteAPIParams = {
  from: AddressOrETH | ''; // The source address or 'ETH' for Ethereum
  to: AddressOrETH | ''; // The destination address or 'ETH' for Ethereum
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
};

export type GetSwapAPIParams = GetQuoteAPIParams & {
  fromAddress: Address; // The address of the user
};

/**
 * Note: exported as public Type
 */
export type GetSwapQuoteParams = {
  from: Token; // The source token for the swap
  to: Token; // The destination token for the swap
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
  isAmountInDecimals?: boolean; // Whether the amount is in decimals
};

/**
 * Note: exported as public Type
 */
export type GetSwapQuoteResponse = Quote | SwapError;

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

export type QuoteWarning = {
  description?: string; // The description of the warning
  message?: string; // The message of the warning
  type?: string; // The type of the warning
};

export type RawTransactionData = {
  data: string; // The transaction data
  from: string; // The sender address
  gas: string; // The gas limit
  gasPrice: string; // The gas price
  to: string; // The recipient address
  value: string; // The value of the transaction
};

/**
 * Note: exported as public Type
 */
export type SwapAmountInputReact = {
  amount?: string; // Token amount
  // disabled?: boolean; // Whether the input is disabled
  // displayMaxButton?: boolean; // Whether the max button is displayed
  label: string; // Descriptive label for the input field
  setAmount?: (amount: string) => void; // Callback function when the amount changes
  // setToken?: (token: Token) => void; // Callback function when the token selector is clicked
  // swappableTokens?: Token[]; // Tokens available for swap
  token: Token; // Selected token
  // tokenBalance?: string; // Amount of selected token user owns
  type: 'to' | 'from';
};

export type SwapAPIParams = GetQuoteAPIParams | GetSwapAPIParams;

export type SwapAPIResponse = {
  approveTx?: RawTransactionData; // The approval transaction
  chainId: string; // The chain ID
  fee: Fee; // The fee for the trade
  quote: Quote; // The quote for the trade
  tx: RawTransactionData; // The trade transaction
};

export type SwapButtonReact = {
  onSubmit?: (params?: SwapParams) => void;
};

export type SwapContextType = {
  // account: Account;
  fromAmount: string;
  fromToken?: Token;
  onSubmit: () => void;
  setFromAmount: (a: string) => void;
  setFromToken: (t: Token) => void;
  setToAmount: (a: string) => void;
  setToToken: (t: Token) => void;
  toAmount: string;
  toToken?: Token;
};

export type SwapParams = {
  amount: string;
  fromAddress: `0x${string}`;
  from: Token;
  to: Token;
};

export type SwapReact = {
  account: Account;
  children: ReactNode;
  // fromToken?: Token;
  // toToken?: Token;
};

/**
 * Note: exported as public Type
 */
export type SwapError = {
  code: number; // The error code
  error: string; // The error message
};

/**
 * Note: exported as public Type
 */
export interface SwapTransaction {
  transaction: Transaction; // The object developers should pass into Viem's signTransaction
  withParams(params: TransactionParams): Transaction;
}

export type Transaction = {
  chainId: number; // The chain ID
  data: Hex; // The data for the transaction
  gas: bigint; // The gas limit
  to: Address; // The recipient address
  value: bigint; // The value of the transaction
  nonce?: number; // The nonce for the transaction
  maxFeePerGas?: bigint | undefined; // The maximum fee per gas
  maxPriorityFeePerGas?: bigint | undefined; // The maximum priority fee per gas
};

export type TransactionParams = {
  nonce: number; // The nonce for the transaction
  maxFeePerGas: bigint | undefined; // The maximum fee per gas
  maxPriorityFeePerGas: bigint | undefined; // The maximum priority fee per gas
};
