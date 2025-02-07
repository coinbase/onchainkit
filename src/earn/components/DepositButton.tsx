import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback } from 'react';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function DepositButton({ className }: DepositButtonReact) {
  const { address, depositCalls, updateLifecycleStatus } = useEarnContext();

  if (!address) {
    return <ConnectWallet className="w-full" text="Connect to deposit" />;
  }

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      // Don't emit duplicate statuses
      if (status.statusName === 'transactionPending') {
        updateLifecycleStatus({ statusName: 'transactionPending' });
      } else if (status.statusName !== 'idle') {
        updateLifecycleStatus(status);
      }
    },
    [updateLifecycleStatus],
  );

  return (
    <Transaction
      className={className}
      calls={depositCalls}
      onStatus={handleOnStatus}
    >
      <TransactionButton text="Deposit" />
    </Transaction>
  );
}
