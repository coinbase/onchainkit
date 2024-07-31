import type { TransactionExecutionError } from 'viem';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import {
  TRANSACTION_ERROR_CODE,
  GENERIC_ERROR_MESSAGE,
  UNCAUGHT_TRANSACTION_ERROR_CODE,
} from '../constants';
import type { TransactionError } from '../types';

type UseWriteContractParams = {
  onError?: (e: TransactionError) => void;
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
};

/**
 * Wagmi hook for single contract transactions.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useWriteContract({
  onError,
  setErrorMessage,
  setTransactionId,
}: UseWriteContractParams) {
  try {
    const { status, writeContractAsync, data } = useWriteContractWagmi({
      mutation: {
        onError: (e) => {
          if (
            (e as TransactionExecutionError)?.cause?.name ===
            'UserRejectedRequestError'
          ) {
            setErrorMessage('Request denied.');
          } else {
            setErrorMessage(GENERIC_ERROR_MESSAGE);
          }
          onError?.({ code: TRANSACTION_ERROR_CODE, error: e.message });
        },
        onSuccess: (id) => {
          setTransactionId(id);
        },
      },
    });
    return { status, writeContractAsync, data };
  } catch (err) {
    onError?.({ code: UNCAUGHT_TRANSACTION_ERROR_CODE, error: JSON.stringify(err) });
    setErrorMessage(GENERIC_ERROR_MESSAGE);
    return { status: 'error', writeContractAsync: () => {} };
  }
}
