import type { Address, TransactionExecutionError } from 'viem';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import {
  GENERIC_ERROR_MESSAGE,
  UNCAUGHT_WRITE_CONTRACT_ERROR_CODE,
  WRITE_CONTRACT_ERROR_CODE,
} from '../constants';
import type { UseWriteContractParams } from '../types';

/**
 * Wagmi hook for single contract transactions.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useWriteContract({
  setErrorMessage,
  setLifeCycleState,
  setTransactionHashArray,
  transactionHashArray,
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
          setLifeCycleState({
            stateName: 'error',
            stateData: { code: WRITE_CONTRACT_ERROR_CODE, error: e.message },
          });
        },
        onSuccess: (hash: Address) => {
          setTransactionHashArray(
            transactionHashArray ? transactionHashArray?.concat(hash) : [hash],
          );
        },
      },
    });
    return { status, writeContractAsync, data };
  } catch (err) {
    setLifeCycleState({
      stateName: 'error',
      stateData: {
        code: UNCAUGHT_WRITE_CONTRACT_ERROR_CODE,
        error: JSON.stringify(err),
      },
    });
    setErrorMessage(GENERIC_ERROR_MESSAGE);
    return { status: 'error', writeContractAsync: () => {} };
  }
}
