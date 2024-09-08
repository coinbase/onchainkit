import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { sendBatchedTransactionsParams } from '../types';

export const sendBatchedTransactions = async ({
  capabilities,
  sendCallsAsync,
  transactions,
  transactionType,
  writeContractsAsync,
}: sendBatchedTransactionsParams) => {
  if (transactionType === TRANSACTION_TYPE_CONTRACTS && transactions) {
    await writeContractsAsync({
      contracts: transactions,
      capabilities,
    });
  }
  if (transactionType === TRANSACTION_TYPE_CALLS && transactions) {
    await sendCallsAsync({
      calls: transactions,
      capabilities,
    });
  }
};
