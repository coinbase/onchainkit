import {
  GENERAL_SWAP_BALANCE_ERROR_CODE,
  GENERAL_SWAP_ERROR_CODE,
  GENERAL_SWAP_QUOTE_ERROR_CODE,
  LOW_LIQUIDITY_ERROR_CODE,
  TOO_MANY_REQUESTS_ERROR_CODE,
  UNCAUGHT_SWAP_ERROR_CODE,
  UNCAUGHT_SWAP_QUOTE_ERROR_CODE,
} from '../constants';

export function getSwapErrorCode(
  context: 'swap' | 'quote' | 'balance' | 'uncaught-swap' | 'uncaught-quote',
  errorCode?: number,
) {
  // TODO: handle additional error codes
  if (errorCode === -32001) {
    return TOO_MANY_REQUESTS_ERROR_CODE;
  }

  if (errorCode === -32602) {
    return LOW_LIQUIDITY_ERROR_CODE;
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
