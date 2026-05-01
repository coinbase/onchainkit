import { useCallsStatus as useCallsStatusWagmi } from 'wagmi/experimental';
import type { UseCallsStatusParams } from '../types';
import { normalizeStatus } from '@/internal/utils/normalizeWagmi';
import { createTransactionError } from '../utils/createTransactionError';

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
      statusData: createTransactionError(
        'TmUCSh01',
        err,
        'Failed to get transaction status. Please verify the transaction ID and try again.',
      ),
    });
    return { status: 'error', transactionHash: undefined };
  }
}
