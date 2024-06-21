import { LOW_LIQUIDITY_ERROR_CODE } from '../constants';
import type { GetSwapMessageParams } from '../types';

export enum SwapMessage {
  BALANCE_ERROR = 'Error fetching token balance',
  INCOMPLETE_FIELD = 'Complete the fields to continue',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  LOW_LIQUIDITY = 'Liquidity too low for the token',
  SWAP_IN_PROGRESS = 'Swap in progress...',
  FETCHING_QUOTE = 'Fetching quote...',
  FETCHING_BALANCE = 'Fetching balance...',
}

export function getSwapMessage({
  convertedFromTokenBalance,
  fromAmount,
  fromToken,
  swapErrorState,
  swapLoadingState,
  toAmount,
  toToken,
}: GetSwapMessageParams) {
  // handle balance error
  if (
    swapErrorState?.fromTokenBalanceError ||
    swapErrorState?.toTokenBalanceError
  ) {
    return SwapMessage.BALANCE_ERROR;
  }
  // handle amount exceeds balance
  if (Number(convertedFromTokenBalance) < Number(fromAmount)) {
    return SwapMessage.INSUFFICIENT_BALANCE;
  }
  if (swapLoadingState?.isSwapLoading) {
    return SwapMessage.SWAP_IN_PROGRESS;
  }
  if (
    swapLoadingState?.isFromQuoteLoading ||
    swapLoadingState?.isToQuoteLoading
  ) {
    return SwapMessage.FETCHING_QUOTE;
  }
  // missing required fields
  if (!fromAmount || !fromToken || !toAmount || !toToken) {
    return SwapMessage.INCOMPLETE_FIELD;
  }
  // error states handled below
  if (!swapErrorState) {
    return '';
  }
  // handle invalid params error
  if (
    Object.values(swapErrorState)?.find(
      (error) => error?.code === LOW_LIQUIDITY_ERROR_CODE,
    )
  ) {
    return SwapMessage.LOW_LIQUIDITY;
  }
  // handle general error
  if (Object.values(swapErrorState).length) {
    return Object.values(swapErrorState)[0]?.error;
  }
}
