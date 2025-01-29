import { useCallback, useMemo } from 'react';
import type { WithdrawBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';
import { getRoundedAmount } from '@/internal/utils/getRoundedAmount';

export function WithdrawBalance({ className }: WithdrawBalanceReact) {
  const { depositedAmount, setWithdrawAmount } = useEarnContext();

  const handleMaxPress = useCallback(() => {
    if (depositedAmount) {
      setWithdrawAmount(depositedAmount);
    }
  }, [depositedAmount, setWithdrawAmount]);

  const balance = useMemo(() => {
    if (!depositedAmount) {
      return '0';
    }
    return getRoundedAmount(depositedAmount.toString(), 4);
  }, [depositedAmount]);

  return (
    <EarnBalance
      className={className}
      title={`${balance} USDC`}
      subtitle="Available to withdraw"
      onActionPress={handleMaxPress}
      showAction={!!depositedAmount}
    />
  );
}
