import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import {
  GENERIC_ERROR_MESSAGE,
  METHOD_NOT_SUPPORTED_ERROR_SUBSTRING,
  UNCAUGHT_WRITE_CONTRACTS_ERROR_CODE,
  WRITE_CONTRACTS_ERROR_CODE,
} from '../constants';
import type { UseWriteContractsParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

/**
 * useWriteContracts: Experimental Wagmi hook for batching transactions.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export function useWriteContracts({
  setLifeCycleStatus,
  setTransactionId,
}: UseWriteContractsParams) {
  try {
    const { status, writeContractsAsync } = useWriteContractsWagmi({
      mutation: {
        onSettled(data, error, variables, context) {
          console.log('settled', data, error, variables, context);
        },
        onError: (e) => {
          // Ignore EOA-specific error to fallback to writeContract
          if (e.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
            return;
          }
          const errorMessage = isUserRejectedRequestError(e)
            ? 'Request denied.'
            : GENERIC_ERROR_MESSAGE;
          setLifeCycleStatus({
            statusName: 'error',
            statusData: {
              code: WRITE_CONTRACTS_ERROR_CODE,
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
    return { status, writeContractsAsync };
  } catch (err) {
    setLifeCycleStatus({
      statusName: 'error',
      statusData: {
        code: UNCAUGHT_WRITE_CONTRACTS_ERROR_CODE,
        error: JSON.stringify(err),
        message: GENERIC_ERROR_MESSAGE,
      },
    });
    return {
      status: 'error',
      writeContracts: () => {},
      writeContractsAsync: () => Promise.resolve({}),
    };
  }
}
