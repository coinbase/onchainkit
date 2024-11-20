import { useCallback } from 'react';
import type { FundSwapTokens } from '../types';

// Refreshes balances and inputs post-swap
export const useResetFundSwapInputs = ({
  fromETH,
  fromUSDC,
  to,
}: FundSwapTokens) => {
  return useCallback(async () => {
    await Promise.all([
      fromETH.balanceResponse?.refetch(),
      fromUSDC.balanceResponse?.refetch(),
      to.balanceResponse?.refetch(),
      fromETH.setAmount(''),
      fromUSDC.setAmount(''),
      fromETH.setAmountUSD(''),
      fromUSDC.setAmountUSD(''),
      to.setAmount(''),
      to.setAmountUSD(''),
    ]);
  }, [fromETH, fromUSDC, to]);
};
