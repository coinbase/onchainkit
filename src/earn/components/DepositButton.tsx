import { cn } from '@/styles/theme';
import {
  type LifecycleStatus,
  Transaction,
  TransactionButton,
  type TransactionResponse,
} from '@/transaction';
import { ConnectWallet } from '@/wallet';
import { useCallback, useMemo, useState } from 'react';
import type { DepositButtonReact } from '../types';
import { useEarnContext } from './EarnProvider';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { EarnEvent } from '@/core/analytics/types';

export function DepositButton({ className }: DepositButtonReact) {
  const {
    recipientAddress: address,
    vaultAddress,
    vaultToken,
    depositCalls,
    depositAmount,
    setDepositAmount,
    depositAmountError,
    updateLifecycleStatus,
    refetchWalletBalance,
    isSponsored,
  } = useEarnContext();
  const { sendAnalytics } = useAnalytics();
  const [depositedAmount, setDepositedAmount] = useState('');

  const analyticsData = useMemo(
    () => ({
      amount: Number(depositAmount) || Number(depositedAmount),
      address,
      tokenAddress: vaultToken?.address,
      vaultAddress,
    }),
    [depositAmount, depositedAmount, address, vaultToken, vaultAddress],
  );

  const handleOnStatus = useCallback(
    (status: LifecycleStatus) => {
      console.log(`${status.statusName}:`, status.statusData);
      switch (status.statusName) {
        case 'buildingTransaction':
          sendAnalytics(EarnEvent.EarnDepositInitiated, analyticsData);
          break;

        case 'transactionPending':
          updateLifecycleStatus({ statusName: 'transactionPending' });
          break;

        case 'error': {
          const type =
            status.statusData.code === 'TmTPc03X'
              ? EarnEvent.EarnDepositFailure
              : EarnEvent.EarnDepositFailure;
          sendAnalytics(type, analyticsData);
          break;
        }

        case 'transactionLegacyExecuted':
        case 'success': {
          sendAnalytics(EarnEvent.EarnDepositSuccess, analyticsData);
          updateLifecycleStatus(status);
          break;
        }
      }
    },
    [updateLifecycleStatus, analyticsData, sendAnalytics],
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
