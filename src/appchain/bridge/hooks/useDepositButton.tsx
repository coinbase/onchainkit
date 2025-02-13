import { Spinner } from '@/internal/components/Spinner';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import type { UseDepositButtonParams } from '../types';

export function useDepositButton({
  depositStatus,
  withdrawStatus,
  bridgeParams,
}: UseDepositButtonParams) {
  const { isConnected } = useAccount();

  const isPending =
    depositStatus === 'depositPending' || withdrawStatus === 'withdrawPending';
  const isRejected =
    depositStatus === 'depositRejected' ||
    withdrawStatus === 'withdrawRejected';

  const buttonContent = useMemo(() => {
    if (isPending) {
      return <Spinner />;
    }
    if (depositStatus === 'depositSuccess') {
      return 'View in Explorer';
    }
    if (isConnected) {
      return 'Confirm';
    }
    return 'Connect Wallet';
  }, [isPending, depositStatus, isConnected]);

  const isDisabled =
    isConnected &&
    (isPending ||
      bridgeParams.amount === '' ||
      Number(bridgeParams.amount) === 0);

  return {
    isPending,
    isRejected,
    buttonContent,
    isDisabled,
  };
}
