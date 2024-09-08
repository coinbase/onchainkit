import { useCallback } from 'react';
import type { UseSendWalletTransactionsParams } from '../types';
import { sendBatchedTransactions } from '../utils/sendBatchedTransactions';
import { sendSingleTransactions } from '../utils/sendSingleTransactions';

export const useSendWalletTransactions = ({
  transactions,
  transactionType,
  capabilities,
  writeContractsAsync,
  writeContractAsync,
  sendCallsAsync,
  sendCallAsync,
  walletCapabilities,
}: UseSendWalletTransactionsParams) => {
  return useCallback(async () => {
    if (!transactions) {
      return;
    }
    if (walletCapabilities.hasAtomicBatch) {
      // Batched transactions
      await sendBatchedTransactions({
        capabilities,
        sendCallsAsync,
        transactions,
        transactionType,
        writeContractsAsync,
      });
    } else {
      // Non-batched transactions
      await sendSingleTransactions({
        sendCallAsync,
        transactions,
        transactionType,
        writeContractAsync,
      });
    }
  }, [
    writeContractsAsync,
    writeContractAsync,
    sendCallsAsync,
    sendCallAsync,
    capabilities,
    transactions,
    transactionType,
    walletCapabilities.hasAtomicBatch,
  ]);
};
