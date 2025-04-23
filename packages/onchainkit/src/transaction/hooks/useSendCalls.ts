import { useSendCalls as useSendCallsWagmi } from 'wagmi/experimental';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import type { UseSendCallsParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';
import { normalizeTransactionId } from '@/internal/utils/normalizeWagmi';

/**
 * useSendCalls: Experimental Wagmi hook for batching transactions with calldata.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export function useSendCalls({
  setLifecycleStatus,
  setTransactionId,
}: UseSendCallsParams) {
  const { status, sendCallsAsync, data, reset } = useSendCallsWagmi({
    mutation: {
      onError: (e) => {
        const errorMessage = isUserRejectedRequestError(e)
          ? 'Request denied.'
          : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmUSCSh01', // Transaction module UseSendCalls hook 01 error
            error: e.message,
            message: errorMessage,
          },
        });
      },
      onSuccess: (data) => {
        setTransactionId(normalizeTransactionId(data));
      },
    },
  });
  return { status, sendCallsAsync, data, reset };
}
