import type { ContractFunctionParameters } from 'viem';
import { TRANSACTION_TYPE_CALLS } from '../constants';
import type { Call, sendSingleTransactionParams } from '../types';

export const sendSingleTransactions = async ({
  sendCallAsync,
  transactions,
  transactionType,
  writeContractAsync,
}: sendSingleTransactionParams) => {
  for (const transaction of transactions) {
    if (transactionType === TRANSACTION_TYPE_CALLS) {
      await sendCallAsync(transaction as Call);
    } else {
      await writeContractAsync(transaction as ContractFunctionParameters);
    }
  }
};
