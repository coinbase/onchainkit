import type { Address } from 'viem';
import { useSendTransaction as useSendCallWagmi } from 'wagmi';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import type { UseSendCallParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

/**
 * Wagmi hook for single transactions with calldata.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useSendCall({
  setLifeCycleStatus,
  transactionHashList,
}: UseSendCallParams) {
  const { status, sendTransactionAsync, data } = useSendCallWagmi({
    mutation: {
      onError: (e) => {
        const errorMessage = isUserRejectedRequestError(e)
          ? 'Request denied.'
          : GENERIC_ERROR_MESSAGE;
        setLifeCycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmUWCh01', // Transaction module UseWriteContract hook 01 error
            error: e.message,
            message: errorMessage,
          },
        });
      },
      onSuccess: (hash: Address) => {
        setLifeCycleStatus({
          statusName: 'transactionLegacyExecuted',
          statusData: {
            transactionHashList: [...transactionHashList, hash],
          },
        });
      },
    },
  });
  return { status, sendTransactionAsync, data };
}
