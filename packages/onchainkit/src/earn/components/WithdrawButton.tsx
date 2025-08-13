'use client';
import { useWithdrawAnalytics } from '@/earn/hooks/useWithdrawAnalytics';
import { cn } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponseType,
} from '@/transaction';
import { TransactionButtonRenderParams } from '@/transaction/types';
import { ConnectWallet } from '@/wallet';
import { useCallback, useState } from 'react';
import type { WithdrawButtonProps } from '../types';
import { useEarnContext } from './EarnProvider';
import { RenderWithdrawButton } from './RenderWithdrawButton';

export function WithdrawButton({ className }: WithdrawButtonProps) {
  const {
    recipientAddress: address,
    withdrawCalls,
    withdrawAmount,
    setWithdrawAmount,
    updateLifecycleStatus,
    refetchDepositedBalance,
    withdrawAmountError,
    vaultToken,
    isSponsored,
  } = useEarnContext();
  const [withdrawnAmount, setWithdrawnAmount] = useState('');
  const { setTransactionState } = useWithdrawAnalytics(withdrawnAmount);

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
    (res: TransactionResponseType) => {
      if (
        res.transactionReceipts[0] &&
        res.transactionReceipts[0].status === 'success'
      ) {
        if (withdrawAmount) {
          setWithdrawnAmount(withdrawAmount);
        }
        setWithdrawAmount('');
        refetchDepositedBalance();
      }
    },
    [setWithdrawAmount, refetchDepositedBalance, withdrawAmount],
  );

  if (!address) {
    return (
      <ConnectWallet
        className={cn('w-full', className)}
        disconnectedLabel="Connect to withdraw"
      />
    );
  }

  return (
    <Transaction
      className={className}
      calls={withdrawCalls}
      onStatus={handleOnStatus}
      onSuccess={handleOnSuccess}
      isSponsored={isSponsored}
      resetAfter={3_000}
    >
      <TransactionButton
        render={(params: TransactionButtonRenderParams) => {
          return (
            <RenderWithdrawButton
              withdrawAmountError={withdrawAmountError}
              withdrawnAmount={withdrawAmount}
              vaultToken={vaultToken}
              {...params}
            />
          );
        }}
        disabled={!!withdrawAmountError || !withdrawAmount}
      />
    </Transaction>
  );
}
