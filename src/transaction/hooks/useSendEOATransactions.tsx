import { useCallback } from 'react';
import type { ContractFunctionParameters } from 'viem';
import type { TransactionExecutionError } from 'viem';
import type { Config } from 'wagmi';
import type {
  SendTransactionMutateAsync,
  WriteContractMutateAsync,
} from 'wagmi/query';
import { TRANSACTION_TYPE_CALLS } from '../constants';
import { GENERIC_ERROR_MESSAGE } from '../constants';
import type { CallsType } from '../types';

export const useSendEOATransactions = ({
  contracts,
  calls,
  transactionType,
  sendTransactionAsync,
  writeContractAsync,
  setErrorMessage,
}: {
  contracts?: ContractFunctionParameters[];
  calls?: CallsType[];
  transactionType: string;
  sendTransactionAsync?:
    | SendTransactionMutateAsync<Config, unknown>
    | (() => void);
  writeContractAsync?: WriteContractMutateAsync<Config, unknown> | (() => void);
  setErrorMessage: (message: string) => void;
}) => {
  return useCallback(async () => {
    try {
      const transactions = contracts || calls || [];

      for (const transaction of transactions) {
        if (transactionType === TRANSACTION_TYPE_CALLS) {
          await sendTransactionAsync?.(transaction as CallsType);
        } else {
          await writeContractAsync?.(transaction as ContractFunctionParameters);
        }
      }
    } catch (err) {
      const errorMessage =
        (err as TransactionExecutionError)?.cause?.name ===
        'UserRejectedRequestError'
          ? 'Request denied.'
          : GENERIC_ERROR_MESSAGE;
      setErrorMessage(errorMessage);
    }
  }, [
    calls,
    contracts,
    sendTransactionAsync,
    writeContractAsync,
    setErrorMessage,
    transactionType,
  ]);
};
