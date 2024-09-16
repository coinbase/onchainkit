import { useCallback } from 'react';
import type { Config } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import type { UseCallsStatusReturnType } from 'wagmi/experimental';
import type { LifecycleStatus } from '../types';

export function useAwaitCalls({
  accountConfig,
  config,
  callsStatus,
  setLifecycleStatus,
}: {
  accountConfig: Config;
  config: {
    maxSlippage: number;
  };
  callsStatus: UseCallsStatusReturnType;
  setLifecycleStatus: React.Dispatch<React.SetStateAction<LifecycleStatus>>;
}) {
  const { data } = callsStatus;

  return useCallback(async () => {
    if (data?.status === 'CONFIRMED' && data?.receipts) {
      const transactionReceipt = await waitForTransactionReceipt(
        accountConfig,
        {
          confirmations: 1,
          hash: data.receipts[data.receipts.length - 1].transactionHash,
        },
      );
      setLifecycleStatus({
        statusName: 'success',
        statusData: {
          isMissingRequiredField: false,
          maxSlippage: config.maxSlippage,
          transactionReceipt,
        },
      });
    }
  }, [accountConfig, config.maxSlippage, data, setLifecycleStatus]);
}
