import { useCallback } from 'react';
import type { BuyTokens } from '../types';

/**
 * Refreshes balances and inputs post-swap
 */
export const useResetBuyInputs = ({
  fromETH,
  fromUSDC,
  from,
  to,
}: BuyTokens) => {
  return useCallback(async () => {
    await Promise.all([
      from?.balanceResponse?.refetch(),
      from?.setAmount(''),
      from?.setAmountUSD(''),
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
  }, [from, fromETH, fromUSDC, to]);
};
