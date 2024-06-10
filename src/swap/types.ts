import type { Address, PrivateKeyAccount } from 'viem';
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

export type GetSwapAPIParams = GetQuoteAPIParams & {
  fromAddress: Address; // The address of the user
};

export type GetQuoteAPIParams = {
  from: AddressOrETH | ''; // The source address or 'ETH' for Ethereum
  to: AddressOrETH | ''; // The destination address or 'ETH' for Ethereum
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
};

export type GetSwapParams = GetQuoteParams & {
  fromAddress: Address; // The address of the user
};

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
export type GetSwapResponse = Swap | SwapError;

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
export type Swap = {
  approveTransaction?: Transaction; // The approval transaction
  fee: Fee; // The fee for the swap
  quote: Quote; // The quote for the swap
  transaction: Transaction; // The swap transaction
  warning?: QuoteWarning; // The warning associated with the swap
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
export type SwapParams = GetQuoteParams | GetSwapParams;

export type SwapAPIParams = GetQuoteAPIParams | GetSwapAPIParams;

/**
 * Note: exported as public Type
 */
export interface Transaction {
  transaction: TransactionData;

  withParams(params: TransactionParams): TransactionData;
}

/**
 * Note: exported as public Type
 */
export type TransactionData = {
  chainId: number; // The chain ID
  data: `0x${string}`; // The data for the transaction
  gas: bigint; // The gas limit
  to: `0x${string}`; // The recipient address
  value: bigint; // The value of the transaction
  nonce?: number; // The nonce for the transaction
  maxFeePerGas?: bigint | undefined; // The maximum fee per gas
  maxPriorityFeePerGas?: bigint | undefined; // The maximum priority fee per gas
};
/**
 * Note: exported as public Type
 */
export type TransactionParams = {
  nonce: number; // The nonce for the transaction
  maxFeePerGas: bigint | undefined; // The maximum fee per gas
  maxPriorityFeePerGas: bigint | undefined; // The maximum priority fee per gas
};

export type Trade = {
  approveTx?: RawTransactionData; // The approval transaction
  chainId: string; // The chain ID
  fee: Fee; // The fee for the trade
  quote: Quote; // The quote for the trade
  tx: RawTransactionData; // The trade transaction
};

export type RawTransactionData = {
  data: string; // The transaction data
  from: string; // The sender address
  gas: string; // The gas limit
  gasPrice: string; // The gas price
  to: string; // The recipient address
  value: string; // The value of the transaction
};
