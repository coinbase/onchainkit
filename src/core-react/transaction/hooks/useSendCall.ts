import { GENERIC_ERROR_MESSAGE } from '@/core/transaction/constants';
import { isUserRejectedRequestError } from '@/core/transaction/utils/isUserRejectedRequestError';
import type { Address } from 'viem';
import { useSendTransaction as useSendCallWagmi } from 'wagmi';
import type { UseSendCallParams } from '../types';

/**
 * Wagmi hook for single transactions with calldata.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useSendCall({
  setLifecycleStatus,
  transactionHashList,
}: UseSendCallParams) {
  const {
    status,
    sendTransactionAsync: sendCallAsync,
    data,
  } = useSendCallWagmi({
    mutation: {
      onError: (e) => {
        const errorMessage = isUserRejectedRequestError(e)
          ? 'Request denied.'
          : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmUSCh01', // Transaction module UseSendCall hook 01 error
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
  return { status, sendCallAsync, data };
}
