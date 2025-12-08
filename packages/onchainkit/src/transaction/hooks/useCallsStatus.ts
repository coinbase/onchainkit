import { useCallsStatus as useCallsStatusWagmi } from 'wagmi/experimental';
import type { UseCallsStatusParams } from '../types';
import { normalizeStatus } from '@/internal/utils/normalizeWagmi';

export function useCallsStatus({
  setLifecycleStatus,
  transactionId,
}: UseCallsStatusParams) {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useCallsStatusWagmi({
      id: transactionId,
      query: {
        refetchInterval: (query) => {
          return normalizeStatus(query.state.data?.status) === 'success'
            ? false
            : 1000;
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
