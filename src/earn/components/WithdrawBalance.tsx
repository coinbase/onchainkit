import { getTruncatedAmount } from '@/earn/utils/getTruncatedAmount';
import { Skeleton } from '@/internal/components/Skeleton';
import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import type { WithdrawBalanceReact } from '../types';
import { EarnBalance } from './EarnBalance';
import { useEarnContext } from './EarnProvider';

export function WithdrawBalance({ className }: WithdrawBalanceReact) {
  const {
    receiptBalance,
    receiptBalanceStatus: status,
    setWithdrawAmount,
    vaultToken,
  } = useEarnContext();
  const { address } = useAccount();
  const handleMaxPress = useCallback(() => {
    if (receiptBalance) {
      setWithdrawAmount(receiptBalance);
    }
  }, [receiptBalance, setWithdrawAmount]);

  const balance = useMemo(() => {
    if (!receiptBalance) {
      return '0';
    }
    return getTruncatedAmount(receiptBalance.toString(), 4);
  }, [receiptBalance]);

  const title = useMemo(() => {
    if (!address) {
      return 'Wallet not connected';
    }
    if (!vaultToken) {
      return <Skeleton className="h-6 w-24" />;
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
      showAction={balance !== '0'}
    />
  );
}
