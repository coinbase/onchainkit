import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback } from 'react';
import type { WithdrawButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function WithdrawButton({ className }: WithdrawButtonReact) {
  const {
    recipientAddress: address,
    withdrawCalls,
    updateLifecycleStatus,
  } = useEarnContext();

  if (!address) {
    return <ConnectWallet className="w-full" text="Connect to withdraw" />;
  }

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      // Don't emit duplicate statuses
      if (status.statusName !== 'init') {
        updateLifecycleStatus(status);
      }
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
