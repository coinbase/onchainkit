import { EarnEvent } from '@/core/analytics/types';
import { sendOCKAnalyticsEvent } from '@/core/analytics/utils/sendAnalytics';
import { useEarnContext } from '@/earn/components/EarnProvider';
import type { LifecycleStatus } from '@/transaction/types';
import { useEffect, useMemo, useRef, useState } from 'react';

export const useWithdrawAnalytics = (withdrawnAmount: string) => {
  const [transactionState, setTransactionState] = useState<
    LifecycleStatus['statusName'] | null
  >(null);
  const successSent = useRef(false);
  const errorSent = useRef(false);

  const { vaultAddress, vaultToken, recipientAddress, withdrawAmount } =
    useEarnContext();

  const analyticsData = useMemo(
    () => ({
      amount: Number(withdrawAmount) || Number(withdrawnAmount), // fall back to withdrawnAmount to avoid sending 0
      address: recipientAddress ?? '',
      tokenAddress: vaultToken?.address ?? '',
      vaultAddress,
    }),
    [
      withdrawAmount,
      withdrawnAmount,
      recipientAddress,
      vaultToken?.address,
      vaultAddress,
    ],
  );

  useEffect(() => {
    if (transactionState === 'buildingTransaction') {
      successSent.current = false;
      sendOCKAnalyticsEvent(EarnEvent.EarnWithdrawInitiated, analyticsData);
    }

    if (transactionState === 'success' && !successSent.current) {
      successSent.current = true;
      sendOCKAnalyticsEvent(EarnEvent.EarnWithdrawSuccess, analyticsData);
    }

    if (transactionState === 'error' && !errorSent.current) {
      errorSent.current = true;
      sendOCKAnalyticsEvent(EarnEvent.EarnWithdrawFailure, analyticsData);
    }
  }, [transactionState, analyticsData]);

  return {
    setTransactionState,
  };
};
