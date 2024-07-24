import type { TransactionExecutionError } from 'viem';
import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import type { TransactionError } from '../types';

type UseWriteContractsParams = {
  onError?: (e: TransactionError) => void;
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
};

export const genericErrorMessage = 'Something went wrong. Please try again.';
const uncaughtErrorCode = 'UNCAUGHT_WRITE_TRANSACTIONS_ERROR';
const errorCode = 'WRITE_TRANSACTIONS_ERROR';
const eoaErrorMesssage = 'this request method is not supported';

/**
 * useWriteContracts: Experimental Wagmi hook for batching transactions.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export function useWriteContracts({
  onError,
  setErrorMessage,
  setTransactionId,
}: UseWriteContractsParams) {
  try {
    const { status, writeContracts } = useWriteContractsWagmi({
      mutation: {
        onError: (e) => {
          // Ignore EOA-specific error to fallback to writeContract
          if (e.message.includes(eoaErrorMesssage)) {
            return;
          }

          if (
            (e as TransactionExecutionError)?.cause?.name ===
            'UserRejectedRequestError'
          ) {
            setErrorMessage('Request denied.');
          } else {
            setErrorMessage(genericErrorMessage);
          }
          onError?.({ code: errorCode, error: e.message });
        },
        onSuccess: (id) => {
          setTransactionId(id);
        },
      },
    });
    return { status, writeContracts };
  } catch (err) {
    onError?.({ code: uncaughtErrorCode, error: JSON.stringify(err) });
    setErrorMessage(genericErrorMessage);
    return { status: 'error', writeContracts: () => {} };
  }
}
