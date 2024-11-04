import { useSendCalls as useSendCalls$1 } from 'wagmi/experimental';
import { GENERIC_ERROR_MESSAGE } from '../constants.js';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError.js';

/**
 * useSendCalls: Experimental Wagmi hook for batching transactions with calldata.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
function useSendCalls({
  setLifecycleStatus,
  setTransactionId
}) {
  const _useSendCalls$ = useSendCalls$1({
      mutation: {
        onError: e => {
          const errorMessage = isUserRejectedRequestError(e) ? 'Request denied.' : GENERIC_ERROR_MESSAGE;
          setLifecycleStatus({
            statusName: 'error',
            statusData: {
              code: 'TmUSCSh01',
              // Transaction module UseSendCalls hook 01 error
              error: e.message,
              message: errorMessage
            }
          });
        },
        onSuccess: id => {
          setTransactionId(id);
        }
      }
    }),
    status = _useSendCalls$.status,
    sendCallsAsync = _useSendCalls$.sendCallsAsync,
    data = _useSendCalls$.data;
  return {
    status,
    sendCallsAsync,
    data
  };
}
export { useSendCalls };
//# sourceMappingURL=useSendCalls.js.map
