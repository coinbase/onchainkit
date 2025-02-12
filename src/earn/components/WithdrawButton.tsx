import { useTemporaryValue } from '@/internal/hooks/useTemporaryValue';
import { cn } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponse,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback, useMemo, useRef } from 'react';
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

  const [withdrawnAmount, setWithdrawnAmount] = useTemporaryValue('', 3_000);

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
    [
      setWithdrawAmount,
      refetchDepositedBalance,
      withdrawAmount,
      setWithdrawnAmount,
    ],
  );

  const buttonText = useMemo(() => {
    if (withdrawAmountError) {
      return withdrawAmountError;
    }
    if (withdrawnAmount && vaultToken?.symbol) {
      return `Withdrew ${withdrawnAmount} ${vaultToken.symbol}`;
    }
    return 'Withdraw';
  }, [withdrawAmountError, withdrawnAmount, vaultToken?.symbol]);

  // Can't reset TransactionButton after success state
  // Instead, we use a key to reset the component
  const prevWithdrawnAmountRef = useRef(withdrawnAmount);

  const resetKey = useMemo(() => {
    const shouldReset =
      prevWithdrawnAmountRef.current && withdrawnAmount === '';
    prevWithdrawnAmountRef.current = withdrawnAmount;
    return shouldReset ? Math.random() : undefined;
  }, [withdrawnAmount]);

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
      key={resetKey}
      className={className}
      calls={withdrawCalls}
      onStatus={handleOnStatus}
      onSuccess={handleOnSuccess}
    >
      <TransactionButton
        text={buttonText}
        successOverride={{ text: buttonText }}
        disabled={!!withdrawAmountError || !withdrawAmount}
      />
    </Transaction>
  );
}
