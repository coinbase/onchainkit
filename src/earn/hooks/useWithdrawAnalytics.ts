import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { EarnEvent } from '@/core/analytics/types';
import { useEarnContext } from '@/earn/components/EarnProvider';
import type { LifecycleStatus } from '@/transaction/types';
import { useEffect, useMemo, useState, useRef } from 'react';

export const useWithdrawAnalytics = () => {
  const [transactionState, setTransactionState] = useState<
    LifecycleStatus['statusName'] | null
  >(null);
  const successSent = useRef(false);
  const errorSent = useRef(false);
  const { sendAnalytics } = useAnalytics();

  const { vaultAddress, vaultToken, withdrawAmount, recipientAddress } =
    useEarnContext();

  const analyticsData = useMemo(
    () => ({
      amount: Number(withdrawAmount),
      currency: vaultToken?.symbol,
      address: recipientAddress ?? '',
      tokenAddress: vaultToken?.address ?? '',
      vaultAddress,
    }),
    [
      withdrawAmount,
      vaultToken?.symbol,
      recipientAddress,
      vaultToken?.address,
      vaultAddress,
    ],
  );

  useEffect(() => {
    if (transactionState === 'buildingTransaction') {
      successSent.current = false;
      sendAnalytics(EarnEvent.EarnWithdrawInitiated, analyticsData);
    }

    if (transactionState === 'success' && !successSent.current) {
      successSent.current = true;
      sendAnalytics(EarnEvent.EarnWithdrawSuccess, analyticsData);
    }

    if (transactionState === 'error' && !errorSent.current) {
      errorSent.current = true;
      sendAnalytics(EarnEvent.EarnWithdrawFailure, analyticsData);
    }
  }, [transactionState, analyticsData, sendAnalytics]);

  return {
    setTransactionState,
  };
};
