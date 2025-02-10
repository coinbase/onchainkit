import { cn } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponse,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback } from 'react';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function DepositButton({ className }: DepositButtonReact) {
  const {
    recipientAddress: address,
    depositCalls,
    setDepositAmount,
    updateLifecycleStatus,
    refetchUnderlyingBalance,
  } = useEarnContext();

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

  const handleOnSuccess = useCallback(
    (res: TransactionResponse) => {
      if (
        res.transactionReceipts[0] &&
        res.transactionReceipts[0].status === 'success'
      ) {
        setDepositAmount('');
        refetchUnderlyingBalance();
      }
    },
    [setDepositAmount, refetchUnderlyingBalance],
  );

  if (!address) {
    return (
      <ConnectWallet
        className={cn('w-full', className)}
        text="Connect to deposit"
      />
    );
  }

  return (
    <Transaction
      className={className}
      calls={depositCalls}
      onStatus={handleOnStatus}
      onSuccess={handleOnSuccess}
    >
      <TransactionButton text="Deposit" />
    </Transaction>
  );
}
