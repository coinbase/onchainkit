import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { cn } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import type { DepositBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';

export function DepositBalance({ className }: DepositBalanceReact) {
  const { convertedBalance, setDepositAmount, vaultToken } = useEarnContext();

  const handleMaxPress = useCallback(() => {
    if (convertedBalance) {
      setDepositAmount(convertedBalance);
    }
  }, [convertedBalance, setDepositAmount]);

  const balance = useMemo(() => {
    if (!convertedBalance) {
      return '0';
    }
    return getTruncatedAmount(convertedBalance.toString(), 6);
  }, [convertedBalance]);

  const title = useMemo(() => {
    if (!vaultToken) {
      return (
        <Skeleton
          className={cn('!bg-[var(--ock-bg-alternate-active)] h-6 w-24')}
        />
      );
    }
    return `${balance} ${vaultToken?.symbol}`;
  }, [balance, vaultToken]);

  return (
    <EarnBalance
      className={className}
      title={title}
      subtitle="Available to deposit"
      onActionPress={handleMaxPress}
      showAction={!!convertedBalance}
    />
  );
}
