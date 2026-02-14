import {
  GENERAL_SWAP_BALANCE_ERROR_CODE,
  GENERAL_SWAP_ERROR_CODE,
  GENERAL_SWAP_QUOTE_ERROR_CODE,
  INTERNAL_ERROR_CODE,
  LOW_LIQUIDITY_ERROR_CODE,
  SERVER_ERROR_CODE,
  TOO_MANY_REQUESTS_ERROR_CODE,
  UNCAUGHT_SWAP_ERROR_CODE,
  UNCAUGHT_SWAP_QUOTE_ERROR_CODE,
} from '../constants';

/**
 * Maps error codes and contexts to appropriate swap error codes.
 *
 * Handles standard JSON-RPC error codes:
 * - -32001: Too many requests (rate limiting)
 * - -32602: Invalid params (typically low liquidity)
 * - -32603: Internal JSON-RPC error
 * - -32000: Server error
 *
 * @param context - The context in which the error occurred
 * @param errorCode - Optional JSON-RPC error code
 * @returns The appropriate swap error code string
 */
export function getSwapErrorCode(
  context: 'swap' | 'quote' | 'balance' | 'uncaught-swap' | 'uncaught-quote',
  errorCode?: number,
) {
  // Handle JSON-RPC error codes
  // -32001: Too many requests / rate limiting
  if (errorCode === -32001) {
    return TOO_MANY_REQUESTS_ERROR_CODE;
  }

  // -32602: Invalid params - typically indicates low liquidity
  if (errorCode === -32602) {
    return LOW_LIQUIDITY_ERROR_CODE;
  }

  // -32603: Internal JSON-RPC error
  if (errorCode === -32603) {
    return INTERNAL_ERROR_CODE;
  }

  // -32000: Server error
  if (errorCode === -32000) {
    return SERVER_ERROR_CODE;
  }

  if (context === 'uncaught-swap') {
    return UNCAUGHT_SWAP_ERROR_CODE;
  }

  if (context === 'uncaught-quote') {
    return UNCAUGHT_SWAP_QUOTE_ERROR_CODE;
  }

  if (context === 'quote') {
    return GENERAL_SWAP_QUOTE_ERROR_CODE;
  }

  if (context === 'balance') {
    return GENERAL_SWAP_BALANCE_ERROR_CODE;
  }

  return GENERAL_SWAP_ERROR_CODE;
}

