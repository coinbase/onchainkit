import type { Address, TransactionExecutionError } from 'viem';
import { useSendTransaction as useSendCallWagmi } from 'wagmi';
import {
  GENERIC_ERROR_MESSAGE,
  SEND_CALL_ERROR_CODE,
  UNCAUGHT_SEND_CALL_ERROR_CODE,
} from '../constants';
import type { TransactionError } from '../types';

type UseWriteContractParams = {
  onError?: (e: TransactionError) => void;
  setErrorMessage: (error: string) => void;
  setTransactionHashArray: (ids: Address[]) => void;
  transactionHashArray?: Address[];
};

/**
 * Wagmi hook for single transactions with calldata.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useSendCall({
  onError,
  setErrorMessage,
  setTransactionHashArray,
  transactionHashArray,
}: UseWriteContractParams) {
  try {
    const { status, sendTransactionAsync, data } = useSendCallWagmi({
      mutation: {
        onError: (e) => {
          if (
            (e as TransactionExecutionError)?.cause?.name ===
            'UserRejectedRequestError'
          ) {
            setErrorMessage('Request denied.');
          } else {
            setErrorMessage(GENERIC_ERROR_MESSAGE);
          }
          onError?.({ code: SEND_CALL_ERROR_CODE, error: e.message });
        },
        onSuccess: (hash: Address) => {
          setTransactionHashArray(
            transactionHashArray ? transactionHashArray?.concat(hash) : [hash],
          );
        },
      },
    });
    return { status, sendTransactionAsync, data };
  } catch (err) {
    onError?.({
      code: UNCAUGHT_SEND_CALL_ERROR_CODE,
      error: JSON.stringify(err),
    });
    setErrorMessage(GENERIC_ERROR_MESSAGE);
    return { status: 'error', sendTransactionAsync: () => {} };
  }
}
