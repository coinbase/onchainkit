import { useCallback } from 'react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useCallsStatus } from 'wagmi/experimental';
import type { UseAwaitCallsParams } from '../types';

export function useAwaitCalls({
  accountConfig,
  callsId,
  config,
  setLifecycleStatus,
}: UseAwaitCallsParams) {
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
