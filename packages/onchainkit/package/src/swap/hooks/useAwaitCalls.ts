import { useCallback } from 'react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useCallsStatus } from 'wagmi/experimental';
import type { UseAwaitCallsParams } from '../types';

export function useAwaitCalls({
  accountConfig,
  lifecycleStatus,
  updateLifecycleStatus,
}: UseAwaitCallsParams) {
  const callsId =
    lifecycleStatus.statusName === 'transactionApproved'
      ? lifecycleStatus.statusData?.callsId
      : undefined;

  const { data } = useCallsStatus({
    id: callsId || '',
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
      updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          transactionReceipt,
        },
      });
    }
  }, [accountConfig, data, updateLifecycleStatus]);
}
