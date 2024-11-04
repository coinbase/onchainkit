import { useCallback } from 'react';

// Refreshes balances and inputs post-swap
const useResetInputs = ({
  from,
  to
}) => {
  return useCallback(async () => {
    await Promise.all([from.balanceResponse?.refetch(), to.balanceResponse?.refetch(), from.setAmount(''), from.setAmountUSD(''), to.setAmount(''), to.setAmountUSD('')]);
  }, [from, to]);
};
export { useResetInputs };
//# sourceMappingURL=useResetInputs.js.map
