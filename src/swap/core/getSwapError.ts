import {
  LOW_LIQUIDITY_ERROR_CODE,
  TOO_MANY_REQUESTS_ERROR_CODE,
  USER_REJECTED_ERROR_CODE,
} from '../constants';
import type { SwapErrorState } from '../types';
import { SwapMessage } from './getSwapMessage';

export function getSwapError(error: SwapErrorState): string | undefined {
  // error states handled below
  if (
    Object.values(error)?.find(
      (error) => error?.code === TOO_MANY_REQUESTS_ERROR_CODE,
    )
  ) {
    return SwapMessage.TOO_MANY_REQUESTS;
  }
  if (
    Object.values(error)?.find(
      (error) => error?.code === LOW_LIQUIDITY_ERROR_CODE,
    )
  ) {
    return SwapMessage.LOW_LIQUIDITY;
  }
  if (
    Object.values(error)?.find(
      (error) => error?.code === USER_REJECTED_ERROR_CODE,
    )
  ) {
    return SwapMessage.USER_REJECTED;
  }
  // handle general error
  if (Object.values(error).length) {
    return Object.values(error)[0]?.error;
  }
}
