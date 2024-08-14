import type { Address } from 'viem';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import {
  GENERIC_ERROR_MESSAGE,
  UNCAUGHT_WRITE_CONTRACT_ERROR_CODE,
  WRITE_CONTRACT_ERROR_CODE,
} from '../constants';
import type { UseWriteContractParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

/**
 * Wagmi hook for single contract transactions.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useWriteContract({
  setLifeCycleStatus,
  setTransactionHashArray,
  transactionHashArray,
}: UseWriteContractParams) {
  try {
    const { status, writeContractAsync, data } = useWriteContractWagmi({
      mutation: {
        onError: (e) => {
          const errorMessage = isUserRejectedRequestError(e)
            ? 'Request denied.'
            : GENERIC_ERROR_MESSAGE;
          setLifeCycleStatus({
            statusName: 'error',
            statusData: {
              code: WRITE_CONTRACT_ERROR_CODE,
              error: e.message,
              message: errorMessage,
            },
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
    setLifeCycleStatus({
      statusName: 'error',
      statusData: {
        code: UNCAUGHT_WRITE_CONTRACT_ERROR_CODE,
        error: JSON.stringify(err),
        message: GENERIC_ERROR_MESSAGE,
      },
    });
    return { status: 'error', writeContractAsync: () => {} };
  }
}
