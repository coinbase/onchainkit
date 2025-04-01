import { useCallback } from 'react';
import type { FromTo } from '../types';

/**
 * Refreshes balances and inputs post-swap
 */
export const useResetInputs = ({ from, to }: FromTo) => {
  return useCallback(async () => {
    await Promise.all([
      from.balanceResponse?.refetch(),
      to.balanceResponse?.refetch(),
      from.setAmount(''),
      from.setAmountUSD(''),
      to.setAmount(''),
      to.setAmountUSD(''),
    ]);
  }, [from, to]);
};
