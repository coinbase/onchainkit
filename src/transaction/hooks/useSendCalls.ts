import type { TransactionExecutionError } from 'viem';
import { useSendCalls as useSendCallsWagmi } from 'wagmi/experimental';
import {
  GENERIC_ERROR_MESSAGE,
  METHOD_NOT_SUPPORTED_ERROR_SUBSTRING,
  SEND_CALLS_ERROR_CODE,
  UNCAUGHT_SEND_CALLS_ERROR_CODE,
} from '../constants';
import type { TransactionError } from '../types';

type UseSendCallsParams = {
  onError?: (e: TransactionError) => void;
  setErrorMessage: (error: string) => void;
  setTransactionId: (id: string) => void;
};

/**
 * useSendCalls: Experimental Wagmi hook for batching transactions with calldata.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export function useSendCalls({
  onError,
  setErrorMessage,
  setTransactionId,
}: UseSendCallsParams) {
  try {
    const { status, sendCallsAsync } = useSendCallsWagmi({
      mutation: {
        onSettled(data, error, variables, context) {
          console.log('settled', data, error, variables, context);
        },
        onError: (e) => {
          // Ignore EOA-specific error to fallback to writeContract
          if (e.message.includes(METHOD_NOT_SUPPORTED_ERROR_SUBSTRING)) {
            return;
          }

          if (
            (e as TransactionExecutionError)?.cause?.name ===
            'UserRejectedRequestError'
          ) {
            setErrorMessage('Request denied.');
          } else {
            setErrorMessage(GENERIC_ERROR_MESSAGE);
          }
          onError?.({ code: SEND_CALLS_ERROR_CODE, error: e.message });
        },
        onSuccess: (id) => {
          setTransactionId(id);
        },
      },
    });
    return { status, sendCallsAsync };
  } catch (err) {
    process.stdout.write('useSendCallsError\n');

    onError?.({
      code: UNCAUGHT_SEND_CALLS_ERROR_CODE,
      error: JSON.stringify(err),
    });
    setErrorMessage(GENERIC_ERROR_MESSAGE);
    return {
      status: 'error',
      sendCalls: () => {},
      sendCallsAsync: () => Promise.resolve({}),
    };
  }
}
