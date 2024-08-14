import { useCallsStatus as useCallsStatusWagmi } from 'wagmi/experimental';
import type { UseCallsStatusParams } from '../types';

const uncaughtErrorCode = 'UNCAUGHT_CALL_STATUS_ERROR';

export function useCallsStatus({
  setLifeCycleStatus,
  transactionId,
}: UseCallsStatusParams) {
  try {
    const { data } = useCallsStatusWagmi({
      id: transactionId,
      query: {
        refetchInterval: (query) => {
          return query.state.data?.status === 'CONFIRMED' ? false : 1000;
        },
        enabled: !!transactionId,
      },
    });
    const transactionHash = data?.receipts?.[0]?.transactionHash;
    return { status: data?.status, transactionHash };
  } catch (err) {
    setLifeCycleStatus({
      statusName: 'error',
      statusData: { code: uncaughtErrorCode, error: JSON.stringify(err) },
    });
    return { status: 'error', transactionHash: undefined };
  }
}
