import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import type { TransactionExecutionError } from 'viem';

type UseWriteContractsParams = {
  onError?: (e: any) => void;
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
};

const genericErrorMessage = 'Something went wrong. Please try again.';

export function useWriteContracts({
  onError,
  setErrorMessage,
  setTransactionId,
}: UseWriteContractsParams) {
  try {
    const { status, writeContracts } = useWriteContractsWagmi({
      mutation: {
        onError: (e) => {
          if (
            (e as TransactionExecutionError)?.cause?.name ===
            'UserRejectedRequestError'
          ) {
            setErrorMessage('Request denied.');
          } else {
            setErrorMessage(genericErrorMessage);
          }
          onError?.(e);
        },
        onSuccess: (id) => {
          setTransactionId(id);
        },
      },
    });
    return { status, writeContracts };
  } catch (err) {
    onError?.(err);
    setErrorMessage(genericErrorMessage);
    return { status: 'error', writeContracts: () => {} };
  }
}
