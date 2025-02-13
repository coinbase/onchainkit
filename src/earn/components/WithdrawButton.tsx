import { cn } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponse,
} from '@/transaction';
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
  } = useEarnContext();

  const [withdrawnAmount, setWithdrawnAmount] = useState('');

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
        text="Connect to withdraw"
      />
    );
  }

  return (
    <Transaction
      className={className}
      calls={withdrawCalls}
      onStatus={handleOnStatus}
      onSuccess={handleOnSuccess}
      resetAfter={3_000}
    >
      <TransactionButton
        text={withdrawAmountError ?? 'Withdraw'}
        successOverride={{
          text: `Withdrew ${withdrawnAmount} ${vaultToken?.symbol}`,
        }}
        disabled={!!withdrawAmountError || !withdrawAmount}
      />
    </Transaction>
  );
}
