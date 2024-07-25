import type { TransactionExecutionError } from 'viem';
import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import { METHOD_NOT_SUPPORTED_ERROR_SUBSTRING } from '../constants';
import type { TransactionError } from '../types';

type UseWriteContractsParams = {
  onError?: (e: TransactionError) => void;
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
};

export const genericErrorMessage = 'Something went wrong. Please try again.';
const uncaughtErrorCode = 'UNCAUGHT_WRITE_TRANSACTIONS_ERROR';
const errorCode = 'WRITE_TRANSACTIONS_ERROR';

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
    const { status, writeContractsAsync } = useWriteContractsWagmi({
      mutation: {
        onSettled(data, error, variables, context) {
          console.log('settled', data, error, variables, context);
        },
        onError: (e) => {
          // Ignore EOA-specific error to fallback to writeContract
          if (e.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
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
    return { status, writeContractsAsync };
  } catch (err) {
    onError?.({ code: uncaughtErrorCode, error: JSON.stringify(err) });
    setErrorMessage(genericErrorMessage);
    return {
      status: 'error',
      writeContracts: () => {},
      writeContractsAsync: () => Promise<{}>,
    };
  }
}
