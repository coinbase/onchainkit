import { cn } from '@/styles/theme';
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
    return (
      <ConnectWallet
        className={cn('w-full', className)}
        text="Connect to withdraw"
      />
    );
  }

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      if (status.statusName === 'transactionPending') {
        updateLifecycleStatus({ statusName: 'transactionPending' });
      }

      if (
        status.statusName === 'transactionLegacyExecuted' ||
        status.statusName === 'success' ||
        status.statusName === 'error'
      ) {
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
