'use client';
import { Spinner } from '@/internal/components/Spinner';
import { useMemo } from 'react';
import type { UseWithdrawButtonParams } from '../types';

export function useWithdrawButton({ withdrawStatus }: UseWithdrawButtonParams) {
  const isPending = withdrawStatus === 'withdrawSuccess';
  const isSuccess = withdrawStatus === 'claimSuccess';
  const isError = withdrawStatus === 'error';
  const buttonDisabled = isPending;
  const buttonContent = isPending ? <Spinner /> : 'Claim';
  const shouldShowClaim =
    withdrawStatus === 'claimReady' || withdrawStatus === 'claimRejected';
  const label = useMemo(() => {
    if (shouldShowClaim) {
      return 'Claim is ready';
    }
    if (isSuccess) {
      return 'Transaction complete';
    }
    if (isError) {
      return 'Error processing withdrawal';
    }
    return 'Confirming transaction';
  }, [shouldShowClaim, isSuccess, isError]);

  return {
    isPending,
    isSuccess,
    isError,
    buttonDisabled,
    buttonContent,
    shouldShowClaim,
    label,
  };
}
