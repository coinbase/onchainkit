import { Spinner } from '@/internal/components/Spinner';
import type { ReactNode } from 'react';

interface UseWithdrawButtonProps {
  withdrawStatus: string;
}

interface UseWithdrawButtonReturn {
  isPending: boolean;
  isSuccess: boolean;
  buttonDisabled: boolean;
  buttonContent: ReactNode;
  shouldShowClaim: boolean;
  label: string;
}

export function useWithdrawButton({
  withdrawStatus,
}: UseWithdrawButtonProps): UseWithdrawButtonReturn {
  const isPending = withdrawStatus === 'claimPending';
  const isSuccess = withdrawStatus === 'claimSuccess';
  const buttonDisabled = isPending;
  const buttonContent = isPending ? <Spinner /> : 'Claim';
  const shouldShowClaim =
    withdrawStatus === 'claimReady' ||
    isPending ||
    withdrawStatus === 'claimRejected';
  const label = shouldShowClaim
    ? 'Claim is ready'
    : isSuccess
      ? 'Transaction complete'
      : 'Confirming transaction';

  return {
    isPending,
    isSuccess,
    buttonDisabled,
    buttonContent,
    shouldShowClaim,
    label,
  };
}
