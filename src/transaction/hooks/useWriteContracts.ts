import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import type { TransactionExecutionError } from 'viem';

type UseWriteContractsParams = {
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
};

export function useWriteContracts({
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
            setErrorMessage('Something went wrong. Please try again.');
          }
        },
        onSuccess: (id) => {
          setTransactionId(id);
        },
      },
    });
    return { status, writeContracts };
  } catch (err) {
    console.log({ err });
    return { status: 'error', writeContracts: () => {} };
  }
}
