import { useSendCalls as useSendCallsWagmi } from 'wagmi/experimental';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import type { UseSendCallsParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

/**
 * useSendCalls: Experimental Wagmi hook for batching transactions with calldata.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export function useSendCalls({
  setLifeCycleStatus,
  setTransactionId,
}: UseSendCallsParams) {
  const { status, sendCallsAsync, data } = useSendCallsWagmi({
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
      onSuccess: (id) => {
        setTransactionId(id);
      },
    },
  });
  return { status, sendCallsAsync, data };
}
