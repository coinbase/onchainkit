import { Capabilities } from '@/core/constants';
import { sendBatchedTransactions } from '@/core/transaction/utils/sendBatchedTransactions';
import { sendSingleTransactions } from '@/core/transaction/utils/sendSingleTransactions';
import { useCallback } from 'react';
import type { ContractFunctionParameters } from 'viem';
import type { Call, UseSendWalletTransactionsParams } from '../types';

// Sends transactions to the wallet using the appropriate hook based on Transaction props and wallet capabilities
export const useSendWalletTransactions = ({
  capabilities,
  sendCallAsync,
  sendCallsAsync,
  walletCapabilities,
}: UseSendWalletTransactionsParams) => {
  return useCallback(
    async (
      transactions?:
        | Call[]
        | ContractFunctionParameters[]
        | Promise<Call[]>
        | Promise<ContractFunctionParameters[]>
        | (Call | ContractFunctionParameters)[],
    ) => {
      if (!transactions) {
        return;
      }

      const resolvedTransactions = await Promise.resolve(transactions);

      if (walletCapabilities[Capabilities.AtomicBatch]?.supported) {
        // Batched transactions
        await sendBatchedTransactions({
          capabilities,
          sendCallsAsync,
          transactions: resolvedTransactions,
        });
      } else {
        // Non-batched transactions
        await sendSingleTransactions({
          sendCallAsync,
          transactions: resolvedTransactions,
        });
      }
    },
    [sendCallsAsync, sendCallAsync, capabilities, walletCapabilities],
  );
};
