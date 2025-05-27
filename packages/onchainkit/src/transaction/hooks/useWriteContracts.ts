import { useWriteContracts as useWriteContractsWagmi } from 'wagmi/experimental';
import {
  GENERIC_ERROR_MESSAGE,
  METHOD_NOT_SUPPORTED_ERROR_SUBSTRING,
} from '../constants';
import type { UseWriteContractsParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';
import { normalizeTransactionId } from '@/internal/utils/normalizeWagmi';

/**
 * useWriteContracts: Experimental Wagmi hook for batching transactions.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export function useWriteContracts({
  setLifecycleStatus,
  setTransactionId,
}: UseWriteContractsParams) {
  const { status, writeContractsAsync } = useWriteContractsWagmi({
    mutation: {
      onError: (e) => {
        // Ignore EOA-specific error to fallback to writeContract
        if (e.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
          return;
        }
        const errorMessage = isUserRejectedRequestError(e)
          ? 'Request denied.'
          : GENERIC_ERROR_MESSAGE;
        setLifecycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmUWCSh01', // Transaction module UseWriteContracts hook 01 error
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
  return { status, writeContractsAsync };
}
