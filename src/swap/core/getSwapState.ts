import type { GetSwapStateParams, SwapLoadingState } from '../types';

export function getSwapState({
  fromTokenBalanceResponse,
  toTokenBalanceResponse,
}: GetSwapStateParams): SwapLoadingState {
  const isFromTokenBalanceLoading = !!fromTokenBalanceResponse?.isLoading;
  const isToTokenBalanceLoading = !!toTokenBalanceResponse?.isLoading;

  return {
    isFromTokenBalanceLoading,
    isToTokenBalanceLoading,
  };
}
