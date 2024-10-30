import type { ContractFunctionParameters } from 'viem';
import { TRANSACTION_TYPE_CALLS } from '../constants';
import type { Call, SendSingleTransactionParams } from '../types';

export const sendSingleTransactions = async ({
  sendCallAsync,
  transactions,
  transactionType,
  writeContractAsync,
}: SendSingleTransactionParams) => {
  for (const transaction of transactions) {
    if (transactionType === TRANSACTION_TYPE_CALLS) {
      await sendCallAsync(transaction as Call);
    } else {
      await writeContractAsync(transaction as ContractFunctionParameters);
    }
  }
};
