import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { SendBatchedTransactionsParams } from '../types';

export const sendBatchedTransactions = async ({
  capabilities,
  sendCallsAsync,
  transactions,
  transactionType,
  writeContractsAsync,
}: SendBatchedTransactionsParams) => {
  if (!transactions) {
    return;
  }
  if (transactionType === TRANSACTION_TYPE_CONTRACTS) {
    await writeContractsAsync({
      contracts: transactions,
      capabilities,
    });
  }
  if (transactionType === TRANSACTION_TYPE_CALLS) {
    await sendCallsAsync({
      calls: transactions,
      capabilities,
    });
  }
};
