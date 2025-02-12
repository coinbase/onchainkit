import { Spinner } from '@/internal/components/Spinner';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import type { BridgeParams } from '../types';

interface UseDepositButtonProps {
  depositStatus: string;
  withdrawStatus: string;
  bridgeParams: BridgeParams;
}

export function useDepositButton({
  depositStatus,
  withdrawStatus,
  bridgeParams,
}: UseDepositButtonProps) {
  const { isConnected } = useAccount();

  const isPending =
    depositStatus === 'depositPending' || withdrawStatus === 'withdrawPending';
  const isRejected =
    depositStatus === 'depositRejected' ||
    withdrawStatus === 'withdrawRejected';

  const buttonContent = isPending ? (
    <Spinner />
  ) : depositStatus === 'success' ? (
    'View in Explorer'
  ) : isConnected ? (
    'Confirm'
  ) : (
    'Connect Wallet'
  );

  const isDisabled =
    isConnected &&
    (depositStatus === 'depositPending' ||
      withdrawStatus === 'withdrawPending' ||
      bridgeParams.amount === '' ||
      Number(bridgeParams.amount) === 0);

  return {
    isPending,
    isRejected,
    buttonContent,
    isDisabled,
  };
}
