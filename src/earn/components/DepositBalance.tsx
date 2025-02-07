import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { cn } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import type { DepositBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';
import { useAccount } from 'wagmi';

export function DepositBalance({ className }: DepositBalanceReact) {
  const { address } = useAccount();
  const {
    setDepositAmount,
    vaultToken,
    underlyingBalance,
    underlyingBalanceStatus: status,
  } = useEarnContext();

  const handleMaxPress = useCallback(() => {
    if (underlyingBalance) {
      setDepositAmount(underlyingBalance);
    }
  }, [underlyingBalance, setDepositAmount]);

  const balance = useMemo(() => {
    if (!underlyingBalance) {
      return '0';
    }
    return getTruncatedAmount(underlyingBalance.toString(), 6);
  }, [underlyingBalance]);

  const title = useMemo(() => {
    if (!address) {
      return 'Wallet not connected';
    }
    // Fetching vault token, but user is connected
    if (!vaultToken) {
      return (
        <Skeleton
          className={cn('!bg-[var(--ock-bg-alternate-active)] h-6 w-24')}
        />
      );
    }
    if (status === 'pending') {
      return (
        <div className="flex gap-1">
          <Skeleton className="!bg-[var(--ock-bg-alternate-active)] h-6 w-12" />
          <span>{vaultToken?.symbol}</span>
        </div>
      );
    }
    return `${balance} ${vaultToken?.symbol}`;
  }, [balance, vaultToken, address, status]);

  const subtitle = useMemo(() => {
    if (!address) {
      return 'Connect wallet to deposit';
    }
    return 'Available to deposit';
  }, [address]);

  return (
    <EarnBalance
      className={className}
      title={title}
      subtitle={subtitle}
      onActionPress={handleMaxPress}
      showAction={!!underlyingBalance}
    />
  );
}
