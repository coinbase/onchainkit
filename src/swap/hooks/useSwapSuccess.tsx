import { useCallback } from 'react';
import type { SwapInput } from '../types';

// Updates the balances and sets the input amounts to 0
export function useSwapSuccess({
  from,
  to,
}: {
  from: SwapInput;
  to: SwapInput;
}) {
  return useCallback(async () => {
    await Promise.all([
      from.refetch(),
      to.refetch(),
      from.setAmount(''),
      to.setAmount(''),
    ]);
  }, [from, to]);
}
