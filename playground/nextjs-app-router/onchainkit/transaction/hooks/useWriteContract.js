import { useWriteContract as useWriteContract$1 } from 'wagmi';
import { GENERIC_ERROR_MESSAGE } from '../constants.js';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError.js';

/**
 * Wagmi hook for single contract transactions.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
function useWriteContract({
  setLifecycleStatus,
  transactionHashList
}) {
  const _useWriteContract$ = useWriteContract$1({
      mutation: {
        onError: e => {
          const errorMessage = isUserRejectedRequestError(e) ? 'Request denied.' : GENERIC_ERROR_MESSAGE;
          setLifecycleStatus({
            statusName: 'error',
            statusData: {
              code: 'TmUWCh01',
              // Transaction module UseWriteContract hook 01 error
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
    status = _useWriteContract$.status,
    writeContractAsync = _useWriteContract$.writeContractAsync,
    data = _useWriteContract$.data;
  return {
    status,
    writeContractAsync,
    data
  };
}
export { useWriteContract };
//# sourceMappingURL=useWriteContract.js.map
