import { useCallback } from 'react';
import type { WithdrawBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';

export function WithdrawBalance({ className }: WithdrawBalanceReact) {
  const { depositedAmount, setWithdrawAmount } = useEarnContext();

  const handleUseMaxPress = useCallback(() => {
    if (depositedAmount) {
      setWithdrawAmount(depositedAmount);
    }
  }, [depositedAmount, setWithdrawAmount]);

  return (
    <EarnBalance
      className={className}
      title={`${depositedAmount} USDC`}
      subtitle="Available to withdraw"
      onActionPress={handleUseMaxPress}
      showAction={!!depositedAmount}
    />
  );
}
