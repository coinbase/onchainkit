import { Transaction, TransactionButton } from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback } from 'react';
import type { LifecycleStatus, WithdrawButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function WithdrawButton({ className }: WithdrawButtonReact) {
  const { address, withdrawCalls, updateLifecycleStatus } = useEarnContext();

  if (!address) {
    return <ConnectWallet className="w-full" />;
  }

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      updateLifecycleStatus(status);
    },
    [updateLifecycleStatus],
  );

  return (
    <Transaction
      className={className}
      calls={withdrawCalls}
      onStatus={handleOnStatus}
    >
      <TransactionButton text="Withdraw" />
    </Transaction>
  );
}
