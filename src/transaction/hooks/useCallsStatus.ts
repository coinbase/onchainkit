import { useCallsStatus as useCallsStatusWagmi } from 'wagmi/experimental';
import type { TransactionError } from '../types';

type UseCallsStatusParams = {
  onError?: (e: TransactionError) => void;
  transactionId: string;
};

const uncaughtErrorCode = 'UNCAUGHT_CALL_STATUS_ERROR';

export function useCallsStatus({
  onError,
  transactionId,
}: UseCallsStatusParams) {
  try {
    const { data } = useCallsStatusWagmi({
      id: transactionId,
      query: {
        refetchInterval: (data) => {
          return data.state.data?.status === 'CONFIRMED' ? false : 1000;
        },
        enabled: !!transactionId,
      },
    });

    const transactionHash = data?.receipts?.[0]?.transactionHash;

    return { status: data?.status, transactionHash };
  } catch (err) {
    onError?.({ code: uncaughtErrorCode, error: JSON.stringify(err) });
    return { status: 'error', transactionHash: undefined };
  }
}
