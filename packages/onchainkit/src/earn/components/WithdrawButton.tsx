'use client';
import { useWithdrawAnalytics } from '@/earn/hooks/useWithdrawAnalytics';
import { Spinner } from '@/internal/components/Spinner';
import { cn, pressable, text } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponse,
} from '@/transaction';
import { TransactionButtonRenderParams } from '@/transaction/types';
import { ConnectWallet } from '@/wallet';
import { useCallback, useState } from 'react';
import type { WithdrawButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';

export function WithdrawButton({ className }: WithdrawButtonReact) {
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
    (res: TransactionResponse) => {
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

  const customRender = useCallback(
    ({
      context,
      onSubmit,
      onSuccess,
      isDisabled,
    }: TransactionButtonRenderParams) => {
      const classNames = cn(
        pressable.primary,
        'rounded-ock-default',
        'w-full rounded-xl',
        'px-4 py-3 font-medium leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        'text-ock-text-inverse',
      );

      if (context.receipt) {
        return (
          <button
            className={classNames}
            onClick={onSuccess}
            disabled={isDisabled}
          >
            {`Withdrew ${withdrawnAmount} ${vaultToken?.symbol}`}
          </button>
        );
      }
      if (context.errorMessage) {
        return (
          <button
            className={classNames}
            onClick={onSubmit}
            disabled={isDisabled}
          >
            {withdrawAmountError ?? 'Try again'}
          </button>
        );
      }
      if (context.isLoading) {
        return (
          <button className={classNames} disabled={isDisabled}>
            <Spinner />
          </button>
        );
      }
      return (
        <button className={classNames} disabled={isDisabled} onClick={onSubmit}>
          Withdraw
        </button>
      );
    },
    [vaultToken?.symbol, withdrawAmountError, withdrawnAmount],
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
        render={customRender}
        disabled={!!withdrawAmountError || !withdrawAmount}
      />
    </Transaction>
  );
}
