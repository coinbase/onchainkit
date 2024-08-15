import { useCallback, useState } from 'react';
import type { Address } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { useConfig, useWriteContract as useWriteContractWagmi } from 'wagmi';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import type { UseWriteContractParams } from '../types';
import { isUserRejectedRequestError } from '../utils/isUserRejectedRequestError';

/**
 * Wagmi hook for single contract transactions.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export function useWriteContract({
  chainId,
  contracts,
  setLifeCycleStatus,
}: UseWriteContractParams) {
  const config = useConfig();
  const [transactionHashArray, setTransactionHashArray] = useState<Address[]>(
    [],
  );

  const getTransactionReceipts = useCallback(async () => {
    const receipts = [];
    for (const hash of transactionHashArray) {
      try {
        const txnReceipt = await waitForTransactionReceipt(config, {
          hash,
          chainId,
        });
        receipts.push(txnReceipt);
      } catch (err) {
        setLifeCycleStatus({
          statusName: 'error',
          statusData: {
            code: 'TmTPc01', // Transaction module TransactionProvider component 01 error
            error: JSON.stringify(err),
            message: GENERIC_ERROR_MESSAGE,
          },
        });
      }
    }
    console.log('getTransactionReceipts', receipts?.length);
    setLifeCycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: receipts,
      },
    });
  }, [chainId, config, setLifeCycleStatus, transactionHashArray]);

  try {
    const { status, writeContractAsync, data } = useWriteContractWagmi({
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
        onSuccess: (hash: Address) => {
          console.log('writeContractAsync', hash);
          setTransactionHashArray(
            transactionHashArray ? transactionHashArray?.concat(hash) : [hash],
          );
          // When all transactions are succesful, get the receipts
          if (
            transactionHashArray.length === contracts.length &&
            contracts?.length > 1
          ) {
            getTransactionReceipts();
          }
        },
      },
    });
    return { status, writeContractAsync, data };
  } catch (err) {
    setLifeCycleStatus({
      statusName: 'error',
      statusData: {
        code: 'TmUWCh02',
        error: JSON.stringify(err),
        message: GENERIC_ERROR_MESSAGE,
      },
    });
    return { status: 'error', writeContractAsync: () => {} };
  }
}
