'use client';
import { useDepositAnalytics } from '@/earn/hooks/useDepositAnalytics';
import { cn } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponse,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback, useState } from 'react';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function DepositButton({ className }: DepositButtonReact) {
  const {
    recipientAddress: address,
    vaultToken,
    depositCalls,
    depositAmount,
    setDepositAmount,
    depositAmountError,
    updateLifecycleStatus,
    refetchWalletBalance,
    isSponsored,
  } = useEarnContext();
  const [depositedAmount, setDepositedAmount] = useState('');
  const { setTransactionState } = useDepositAnalytics(depositedAmount);

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      setTransactionState(status.statusName);

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
    [updateLifecycleStatus, setTransactionState],
  );

  const handleOnSuccess = useCallback(
    (res: TransactionResponse) => {
      if (
        res.transactionReceipts[0] &&
        res.transactionReceipts[0].status === 'success'
      ) {
        // Don't overwrite to '' when the second txn comes in
        if (depositAmount) {
          setDepositedAmount(depositAmount);
        }
        setDepositAmount('');
        refetchWalletBalance();
      }
    },
    [depositAmount, setDepositAmount, refetchWalletBalance],
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
      isSponsored={isSponsored}
      resetAfter={3_000}
    >
      <TransactionButton
        text={depositAmountError ?? 'Deposit'}
        successOverride={{
          text: `Deposited ${depositedAmount} ${vaultToken?.symbol}`,
        }}
        disabled={!!depositAmountError || !depositAmount}
      />
    </Transaction>
  );
}
