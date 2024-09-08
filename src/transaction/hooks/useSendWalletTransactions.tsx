import { useCallback } from 'react';
import type { ContractFunctionParameters } from 'viem';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { UseSendWalletTransactionsParams } from '../types';
import type { Call } from '../types';

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
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this hook once Wagmi exposes experimental types
  return useCallback(async () => {
    if (!transactions) {
      return;
    }
    // Batched transactions
    if (walletCapabilities.hasAtomicBatch) {
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
    } else {
      // Non-batched transactions
      for (const transaction of transactions) {
        if (transactionType === TRANSACTION_TYPE_CALLS) {
          await sendCallAsync(transaction as Call);
        } else {
          await writeContractAsync(transaction as ContractFunctionParameters);
        }
      }
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
