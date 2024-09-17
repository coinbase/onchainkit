import { useCallback } from 'react';
import type { Config } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useCallsStatus } from 'wagmi/experimental';
import type { LifecycleStatus } from '../types';

export function useAwaitCalls({
  accountConfig,
  callsId,
  config,
  setLifecycleStatus,
}: {
  accountConfig: Config;
  callsId: string | undefined;
  config: {
    maxSlippage: number;
  };
  setLifecycleStatus: React.Dispatch<React.SetStateAction<LifecycleStatus>>;
}) {
  const { data } = useCallsStatus({
    id: callsId || '0x',
    query: {
      refetchInterval: (query) => {
        return query.state.data?.status === 'CONFIRMED' ? false : 1000;
      },
      enabled: callsId !== undefined,
    },
  });

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
