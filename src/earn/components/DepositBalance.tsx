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
    if (!address) {
      return 'Wallet not connected';
    }
    return `${balance} ${vaultToken?.symbol}`;
  }, [balance, vaultToken, address]);

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
      showAction={!!convertedBalance}
    />
  );
}
