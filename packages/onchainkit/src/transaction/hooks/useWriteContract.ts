import type { Address } from 'viem';
import { useWriteContract as useWriteContractWagmi } from 'wagmi';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import type { UseWriteContractParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

/**
 * Wagmi hook for single contract transactions.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useWriteContract({
  setLifecycleStatus,
  transactionHashList,
}: UseWriteContractParams) {
  const { status, writeContractAsync, data } = useWriteContractWagmi({
    mutation: {
      onError: (e) => {
        const errorMessage = isUserRejectedRequestError(e)
          ? 'Request denied.'
          : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmUWCh01', // Transaction module UseWriteContract hook 01 error
            error: e.message,
            message: errorMessage,
          },
        });
      },
      onSuccess: (hash: Address) => {
        setLifecycleStatus({
          statusName: 'transactionLegacyExecuted',
          statusData: {
            transactionHashList: [...transactionHashList, hash],
          },
        });
      },
    },
  });
  return { status, writeContractAsync, data };
}
