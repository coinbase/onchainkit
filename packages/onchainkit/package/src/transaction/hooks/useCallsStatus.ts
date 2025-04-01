import { useCallsStatus as useCallsStatusWagmi } from 'wagmi/experimental';
import type { UseCallsStatusParams } from '../types';

export function useCallsStatus({
  setLifecycleStatus,
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
    setLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: 'TmUCSh01',
        error: JSON.stringify(err),
        message: '',
      },
    });
    return { status: 'error', transactionHash: undefined };
  }
}
