import type { Address } from 'viem';
import type { HydratedCharge } from '../pay/types';
import type { SwapQuote } from '../swap/types';
import type { Token } from '../token/types';

export type AddressOrETH = Address | 'ETH';

/**
 * Note: exported as public Type
 */
export type APIError = {
  code: string; // The Error code
  error: string; // The Error long message
  message: string; // The Error short message
};

/**
 * Note: exported as public Type
 */
export type BuildSwapTransactionParams = GetSwapQuoteParams & {
  fromAddress: Address; // The address of the user
};

export type GetAPIParamsForToken =
  | GetSwapQuoteParams
  | BuildSwapTransactionParams;

export type GetQuoteAPIParams = {
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
  from: AddressOrETH | ''; // The source address or 'ETH' for Ethereum
  to: AddressOrETH | ''; // The destination address or 'ETH' for Ethereum
  v2Enabled?: boolean; // Whether to use V2 of the API (default: false)
  slippagePercentage?: string; // The slippage percentage for the swap
};

export type GetSwapAPIParams = GetQuoteAPIParams & {
  fromAddress: Address; // The address of the user
};

/**
 * Note: exported as public Type
 */
export type GetSwapQuoteParams = {
  amount: string; // The amount to be swapped
  amountReference?: string; // The reference amount for the swap
  from: Token; // The source token for the swap
  isAmountInDecimals?: boolean; // Whether the amount is in decimals
  maxSlippage?: string; // The slippage of the swap
  to: Token; // The destination token for the swap
  useAggregator: boolean; // Whether to use a DEX aggregator
};

/**
 * Note: exported as public Type
 */
export type GetSwapQuoteResponse = SwapQuote | APIError;

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
export type GetTokensResponse = Token[] | APIError;

export type RawTransactionData = {
  data: string; // The transaction data
  from: string; // The sender address
  gas: string; // The gas limit
  gasPrice: string; // The gas price
  to: string; // The recipient address
  value: string; // The value of the transaction
};

export type SwapAPIParams = GetQuoteAPIParams | GetSwapAPIParams;

/**
 * Note: exported as public Type
 */
export type HydrateChargeParams = {
  sender: Address; // The address of the wallet paying
  chargeId: string; // The ID of the Commerce Charge to be paid
};

export type HydrateChargeAPIParams = {
  sender: Address; // The address of the wallet paying
  chainId: 8453; // The Chain ID of the payment Network (only Base is supported)
  chargeId: string; // The ID of the Commerce Charge to be paid
};

/**
 * Note: exported as public Type
 */
export type HydrateChargeResponse = HydratedCharge | APIError;
