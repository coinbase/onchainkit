import { Spinner } from '@/internal/components/Spinner';
import { useMemo } from 'react';
import type { UseWithdrawButtonParams } from '../types';

export function useWithdrawButton({ withdrawStatus }: UseWithdrawButtonParams) {
  const isPending = withdrawStatus === 'claimPending';
  const isSuccess = withdrawStatus === 'claimSuccess';
  const buttonDisabled = isPending;
  const buttonContent = isPending ? <Spinner /> : 'Claim';
  const shouldShowClaim =
    withdrawStatus === 'claimReady' ||
    isPending ||
    withdrawStatus === 'claimRejected';
  const label = useMemo(() => {
    if (shouldShowClaim) {
      return 'Claim is ready';
    }
    if (isSuccess) {
      return 'Transaction complete';
    }
    return 'Confirming transaction';
  }, [shouldShowClaim, isSuccess]);

  return {
    isPending,
    isSuccess,
    buttonDisabled,
    buttonContent,
    shouldShowClaim,
    label,
  };
}
