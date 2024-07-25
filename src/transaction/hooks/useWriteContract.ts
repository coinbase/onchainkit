import type { TransactionExecutionError } from 'viem';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import type { TransactionError } from '../types';
import { genericErrorMessage } from './useWriteContracts';

type UseWriteContractParams = {
  onError?: (e: TransactionError) => void;
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
};

const uncaughtErrorCode = 'UNCAUGHT_WRITE_TRANSACTIONS_ERROR';
const errorCode = 'WRITE_TRANSACTIONS_ERROR';

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
    const { status, writeContract, writeContractAsync, data } =
      useWriteContractWagmi({
        mutation: {
          onError: (e) => {
            console.log('WE GOT HIM');
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
    return { status, writeContract, writeContractAsync, data };
  } catch (err) {
    onError?.({ code: uncaughtErrorCode, error: JSON.stringify(err) });
    setErrorMessage(genericErrorMessage);
    return { status: 'error', writeContract: () => {} };
  }
}
