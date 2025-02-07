import { cn, color } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponse,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback } from 'react';
import type { WithdrawButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';
export function WithdrawButton({ className }: WithdrawButtonReact) {
  const {
    recipientAddress: address,
    withdrawCalls,
    withdrawAmount,
    setWithdrawAmount,
    updateLifecycleStatus,
    refetchReceiptBalance,
    withdrawAmountError,
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
      console.log('res:', res);
      if (
        res.transactionReceipts[0] &&
        res.transactionReceipts[0].status === 'success'
      ) {
        setWithdrawAmount('');
        refetchReceiptBalance();
      }
    },
    [setWithdrawAmount, refetchReceiptBalance],
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
    <div className="-mt-4 flex flex-col gap-1">
      {withdrawAmountError ? (
        <p className={cn(color.error, 'text-xs')}>{withdrawAmountError}</p>
      ) : (
        <div className="h-4" /> // Empty div to keep the layout consistent
      )}

      <Transaction
        className={className}
        calls={withdrawCalls}
        onStatus={handleOnStatus}
        onSuccess={handleOnSuccess}
      >
        <TransactionButton
          text="Withdraw"
          disabled={!!withdrawAmountError || !withdrawAmount}
        />
      </Transaction>
    </div>
  );
}
