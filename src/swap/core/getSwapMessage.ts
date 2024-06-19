import type { GetSwapMessageParams } from '../types';

export enum SwapMessage {
  BALANCE_ERROR = 'Error fetching token balance',
  INCOMPLETE_FIELD = 'Complete the fields to continue',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  IS_LOADING = 'Loading...',
  LOW_LIQUIDITY = 'Liquidity too low for the token',
}

const LOW_LIQUIDITY_ERROR_CODE = -32602;

export function getSwapMessage({
  error,
  convertedFromTokenBalance,
  fromAmount,
  fromToken,
  swapErrorState,
  swapLoadingState,
  toAmount,
  toToken,
}: GetSwapMessageParams) {
  // amount exceeds balance
  if (Number(convertedFromTokenBalance) < Number(fromAmount)) {
    return SwapMessage.INSUFFICIENT_BALANCE;
  }
  // handle loading
  if (swapLoadingState && Object.values(swapLoadingState).includes(true)) {
    return SwapMessage.IS_LOADING;
  }

  // handle balance error
  if (
    swapErrorState?.fromTokenBalanceError ||
    swapErrorState?.toTokenBalanceError
  ) {
    return SwapMessage.BALANCE_ERROR;
  }

  // low liquidity
  if (error?.code === LOW_LIQUIDITY_ERROR_CODE) {
    return SwapMessage.LOW_LIQUIDITY;
  }

  // missing required fields
  if (!fromAmount || !fromToken || !toAmount || !toToken) {
    return SwapMessage.INCOMPLETE_FIELD;
  }

  // TODO: handle swap quote error

  if (error) {
    return error.error;
  }
}
