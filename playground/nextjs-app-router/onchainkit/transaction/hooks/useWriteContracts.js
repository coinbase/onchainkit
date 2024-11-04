import { useWriteContracts as useWriteContracts$1 } from 'wagmi/experimental';
import { METHOD_NOT_SUPPORTED_ERROR_SUBSTRING, GENERIC_ERROR_MESSAGE } from '../constants.js';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError.js';

/**
 * useWriteContracts: Experimental Wagmi hook for batching transactions.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
function useWriteContracts({
  setLifecycleStatus,
  setTransactionId
}) {
  const _useWriteContracts$ = useWriteContracts$1({
      mutation: {
        onError: e => {
          // Ignore EOA-specific error to fallback to writeContract
          if (e.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
            return;
          }
          const errorMessage = isUserRejectedRequestError(e) ? 'Request denied.' : GENERIC_ERROR_MESSAGE;
          setLifecycleStatus({
            statusName: 'error',
            statusData: {
              code: 'TmUWCSh01',
              // Transaction module UseWriteContracts hook 01 error
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
    status = _useWriteContracts$.status,
    writeContractsAsync = _useWriteContracts$.writeContractsAsync;
  return {
    status,
    writeContractsAsync
  };
}
export { useWriteContracts };
//# sourceMappingURL=useWriteContracts.js.map
