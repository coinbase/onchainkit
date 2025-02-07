import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { useCallback, useMemo } from 'react';
import type { WithdrawBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';
import { useAccount } from 'wagmi';

export function WithdrawBalance({ className }: WithdrawBalanceReact) {
  const { depositedAmount, setWithdrawAmount, vaultToken, balanceStatus } =
    useEarnContext();
  const { address } = useAccount();
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
    if (address && balanceStatus === 'pending') {
      return (
        <div className="flex gap-1">
          <Skeleton className="!bg-[var(--ock-bg-alternate-active)] h-6 w-12" />
          <span>{vaultToken?.symbol}</span>
        </div>
      );
    }
    if (!address) {
      return 'Wallet not connected';
    }
    return (
      <>
        {balance} {vaultToken?.symbol}
      </>
    );
  }, [balance, vaultToken, address, balanceStatus]);

  const subtitle = useMemo(() => {
    if (!address) {
      return 'Connect wallet to withdraw';
    }
    return 'Available to withdraw';
  }, [address]);

  return (
    <EarnBalance
      className={className}
      title={title}
      subtitle={subtitle}
      onActionPress={handleMaxPress}
      showAction={!!depositedAmount}
    />
  );
}
