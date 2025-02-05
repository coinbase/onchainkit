import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { useCallback, useMemo } from 'react';
import type { WithdrawBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';
import { Skeleton } from '@/internal/components/Skeleton';

export function WithdrawBalance({ className }: WithdrawBalanceReact) {
  const { depositedAmount, setWithdrawAmount, vaultToken } = useEarnContext();

  const handleMaxPress = useCallback(() => {
    if (depositedAmount) {
      setWithdrawAmount(depositedAmount);
    }
  }, [depositedAmount, setWithdrawAmount]);

  const balance = useMemo(() => {
    if (!depositedAmount) {
      return '0';
    }
    return getTruncatedAmount(depositedAmount.toString(), 4);
  }, [depositedAmount]);

  const title = useMemo(() => {
    if (!vaultToken) {
      return <Skeleton className="h-6 w-24" />;
    }
    return `${balance} ${vaultToken?.symbol}`;
  }, [balance, vaultToken]);

  return (
    <EarnBalance
      className={className}
      title={title}
      subtitle="Available to withdraw"
      onActionPress={handleMaxPress}
      showAction={!!depositedAmount}
    />
  );
}
