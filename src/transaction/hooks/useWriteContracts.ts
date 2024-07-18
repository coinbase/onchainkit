import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { AbiFunctionNotFoundError, TransactionExecutionError } from 'viem';

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
          const errorMessage = getErrorMessage({
            cause: (e as TransactionExecutionError)?.cause?.name,
            name: e.name,
            shortMessage: (e as AbiFunctionNotFoundError)?.shortMessage,
            message: e.message,
          });
          setErrorMessage(errorMessage);
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
