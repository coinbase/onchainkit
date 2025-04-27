import type { SendBatchedTransactionsParams } from '../types';
import { isContract } from './isContract';

export const sendBatchedTransactions = async ({
  capabilities,
  sendCallsAsync,
  transactions,
}: SendBatchedTransactionsParams) => {
  if (!transactions) {
    return;
  }

  const calls = transactions?.map((transaction) => {
    if (isContract(transaction)) {
      const { address, ...rest } = transaction;
      return {
        ...rest,
        to: address,
      };
    }
    return transaction;
  });

  await sendCallsAsync({
    calls,
    capabilities,
  });
};
