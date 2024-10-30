import { B as BuildSwapTransactionParams, a as BuildSwapTransactionResponse, b as BuildPayTransactionParams, c as BuildPayTransactionResponse, G as GetSwapQuoteParams, d as GetSwapQuoteResponse, e as GetTokensOptions, f as GetTokensResponse } from '../types-BRVO_IxW.js';
export { A as APIError, g as BuildSwapTransaction } from '../types-BRVO_IxW.js';
import 'viem';
import 'react';
import '../types-C3pTIy0E.js';

/**
 * Retrieves an unsigned transaction for a swap from Token A to Token B.
 */
declare function buildSwapTransaction(params: BuildSwapTransactionParams): Promise<BuildSwapTransactionResponse>;

declare function buildPayTransaction({ address, chargeId, productId, }: BuildPayTransactionParams): Promise<BuildPayTransactionResponse>;

/**
 * Retrieves a quote for a swap from Token A to Token B.
 */
declare function getSwapQuote(params: GetSwapQuoteParams): Promise<GetSwapQuoteResponse>;

/**
 * Retrieves a list of tokens on Base.
 */
declare function getTokens(options?: GetTokensOptions): Promise<GetTokensResponse>;

export { BuildPayTransactionParams, BuildPayTransactionResponse, BuildSwapTransactionParams, BuildSwapTransactionResponse, GetSwapQuoteParams, GetSwapQuoteResponse, GetTokensOptions, GetTokensResponse, buildPayTransaction, buildSwapTransaction, getSwapQuote, getTokens };
