import { useCallback } from 'react';
import type { FundSwapTokens } from '../types';

// Refreshes balances and inputs post-swap
export const useResetFundSwapInputs = ({
  fromETH,
  fromUSDC,
  from,
  to,
}: FundSwapTokens) => {
  return useCallback(async () => {
    await Promise.all([
      from.balanceResponse?.refetch(),
      from.setAmount(''),
      from.setAmountUSD(''),
      fromETH.balanceResponse?.refetch(),
      fromETH.setAmount(''),
      fromETH.setAmountUSD(''),
      fromUSDC.balanceResponse?.refetch(),
      fromUSDC.setAmount(''),
      fromUSDC.setAmountUSD(''),
      to.balanceResponse?.refetch(),
      to.setAmount(''),
      to.setAmountUSD(''),
    ]);
  }, [fromETH, fromUSDC, to]);
};
