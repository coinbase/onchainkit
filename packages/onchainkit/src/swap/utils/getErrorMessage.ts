import {
  LOW_LIQUIDITY_ERROR_CODE,
  SwapMessage,
  TOO_MANY_REQUESTS_ERROR_CODE,
  USER_REJECTED_ERROR_CODE,
} from '../constants';
import type { SwapError } from '../types';

export function getErrorMessage(error: SwapError): string | undefined {
  // error states handled below
  if (error.code === TOO_MANY_REQUESTS_ERROR_CODE) {
    return SwapMessage.TOO_MANY_REQUESTS;
  }
  if (error.code === LOW_LIQUIDITY_ERROR_CODE) {
    return SwapMessage.LOW_LIQUIDITY;
  }
  if (error.code === USER_REJECTED_ERROR_CODE) {
    return SwapMessage.USER_REJECTED;
  }
  // handle general error
  return error.message;
}
