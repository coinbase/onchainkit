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
  } = useEarnContext();

  const [depositedAmount, setDepositedAmount] = useTemporaryValue('', 3_000);

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
        // Don't overwrite to '' when the second txn comes in
        if (depositAmount) {
          setDepositedAmount(depositAmount);
        }
        setDepositAmount('');
        refetchWalletBalance();
      }
    },
    [depositAmount, setDepositAmount, refetchWalletBalance, setDepositedAmount],
  );

  const buttonText = useMemo(() => {
    if (depositAmountError) {
      return depositAmountError;
    }
    if (depositedAmount && vaultToken?.symbol) {
      return `Deposited ${depositedAmount} ${vaultToken.symbol}`;
    }
    return 'Deposit';
  }, [depositAmountError, depositedAmount, vaultToken?.symbol]);

  // Can't reset TransactionButton after success state
  // Instead, we use a key to reset the component
  const prevDepositedAmountRef = useRef(depositedAmount);

  const resetKey = useMemo(() => {
    const shouldReset =
      prevDepositedAmountRef.current && depositedAmount === '';
    prevDepositedAmountRef.current = depositedAmount;
    return shouldReset ? Math.random() : undefined;
  }, [depositedAmount]);

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
      key={resetKey}
      className={className}
      calls={depositCalls}
      onStatus={handleOnStatus}
      onSuccess={handleOnSuccess}
    >
      <TransactionButton
        text={buttonText}
        successOverride={{ text: buttonText }}
        disabled={!!depositAmountError || (!depositAmount && !depositedAmount)}
      />
    </Transaction>
  );
}
