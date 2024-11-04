import { useCallback } from 'react';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useCallsStatus } from 'wagmi/experimental';
function useAwaitCalls({
  accountConfig,
  lifecycleStatus,
  updateLifecycleStatus
}) {
  const callsId = lifecycleStatus.statusName === 'transactionApproved' ? lifecycleStatus.statusData?.callsId : undefined;
  const _useCallsStatus = useCallsStatus({
      id: callsId || '',
      query: {
        refetchInterval: query => {
          return query.state.data?.status === 'CONFIRMED' ? false : 1000;
        },
        enabled: callsId !== undefined
      }
    }),
    data = _useCallsStatus.data;
  return useCallback(async () => {
    if (data?.status === 'CONFIRMED' && data?.receipts) {
      const transactionReceipt = await waitForTransactionReceipt(accountConfig, {
        confirmations: 1,
        hash: data.receipts[data.receipts.length - 1].transactionHash
      });
      updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          transactionReceipt
        }
      });
    }
  }, [accountConfig, data, updateLifecycleStatus]);
}
export { useAwaitCalls };
//# sourceMappingURL=useAwaitCalls.js.map
