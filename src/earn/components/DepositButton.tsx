import { cn } from '@/styles/theme';
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
  const {
    recipientAddress: address,
    depositCalls,
    updateLifecycleStatus,
  } = useEarnContext();

  if (!address) {
    return (
      <ConnectWallet
        className={cn('w-full', className)}
        text="Connect to deposit"
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
      calls={depositCalls}
      onStatus={handleOnStatus}
    >
      <TransactionButton text="Deposit" />
    </Transaction>
  );
}
