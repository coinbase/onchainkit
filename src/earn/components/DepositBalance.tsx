'use client';
import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { cn } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import type { DepositBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';

export function DepositBalance({ className }: DepositBalanceReact) {
  const { address } = useAccount();
  const {
    setDepositAmount,
    vaultToken,
    walletBalance,
    walletBalanceStatus: status,
  } = useEarnContext();

  const handleMaxPress = useCallback(() => {
    if (walletBalance) {
      setDepositAmount(walletBalance);
    }
  }, [walletBalance, setDepositAmount]);

  const balance = useMemo(() => {
    if (!walletBalance) {
      return '0';
    }
    return getTruncatedAmount(walletBalance.toString(), 6);
  }, [walletBalance]);

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
      showAction={!!walletBalance}
    />
  );
}
