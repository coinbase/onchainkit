import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { EarnEvent } from '@/core/analytics/types';
import { useEarnContext } from '@/earn/components/EarnProvider';
import type { LifecycleStatus } from '@/transaction/types';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useDepositAnalytics = (depositedAmount: string) => {
  const [transactionState, setTransactionState] = useState<
    LifecycleStatus['statusName'] | null
  >(null);
  // Undesirable, but required because Transaction emits multiple success and error events
  const successSent = useRef(false);
  const errorSent = useRef(false);
  const { sendAnalytics } = useAnalytics();
  const { vaultAddress, vaultToken, recipientAddress, depositAmount } =
    useEarnContext();

  const analyticsData = useMemo(
    () => ({
      amount: Number(depositAmount) || Number(depositedAmount), // fall back to depositedAmount to avoid sending 0
      address: recipientAddress ?? '',
      tokenAddress: vaultToken?.address ?? '',
      vaultAddress,
    }),
    [
      depositedAmount,
      depositAmount,
      recipientAddress,
      vaultToken?.address,
      vaultAddress,
    ],
  );

  useEffect(() => {
    if (transactionState === 'buildingTransaction') {
      successSent.current = false; // in case user does a second deposit
      sendAnalytics(EarnEvent.EarnDepositInitiated, analyticsData);
    }

    if (transactionState === 'success' && !successSent.current) {
      successSent.current = true;
      sendAnalytics(EarnEvent.EarnDepositSuccess, analyticsData);
    }

    if (transactionState === 'error' && !errorSent.current) {
      errorSent.current = true;
      sendAnalytics(EarnEvent.EarnDepositFailure, analyticsData);
    }
  }, [transactionState, analyticsData, sendAnalytics]);

  return {
    setTransactionState,
  };
};
