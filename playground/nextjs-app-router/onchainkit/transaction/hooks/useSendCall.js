import { useSendTransaction } from 'wagmi';
import { GENERIC_ERROR_MESSAGE } from '../constants.js';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError.js';

/**
 * Wagmi hook for single transactions with calldata.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
function useSendCall({
  setLifecycleStatus,
  transactionHashList
}) {
  const _useSendTransaction = useSendTransaction({
      mutation: {
        onError: e => {
          const errorMessage = isUserRejectedRequestError(e) ? 'Request denied.' : GENERIC_ERROR_MESSAGE;
          setLifecycleStatus({
            statusName: 'error',
            statusData: {
              code: 'TmUSCh01',
              // Transaction module UseSendCall hook 01 error
              error: e.message,
              message: errorMessage
            }
          });
        },
        onSuccess: hash => {
          setLifecycleStatus({
            statusName: 'transactionLegacyExecuted',
            statusData: {
              transactionHashList: [...transactionHashList, hash]
            }
          });
        }
      }
    }),
    status = _useSendTransaction.status,
    sendCallAsync = _useSendTransaction.sendTransactionAsync,
    data = _useSendTransaction.data;
  return {
    status,
    sendCallAsync,
    data
  };
}
export { useSendCall };
//# sourceMappingURL=useSendCall.js.map
