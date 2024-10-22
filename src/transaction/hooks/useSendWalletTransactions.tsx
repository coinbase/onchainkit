import { useCallback } from 'react';
import type { ContractFunctionParameters } from 'viem';
import { Capabilities } from '../../constants';
import type { Call, UseSendWalletTransactionsParams } from '../types';
import { sendBatchedTransactions } from '../utils/sendBatchedTransactions';
import { sendSingleTransactions } from '../utils/sendSingleTransactions';

// Sends transactions to the wallet using the appropriate hook based on Transaction props and wallet capabilities
export const useSendWalletTransactions = ({
  capabilities,
  sendCallAsync,
  sendCallsAsync,
  transactionType,
  walletCapabilities,
  writeContractAsync,
  writeContractsAsync,
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
          transactionType,
          writeContractsAsync,
        });
      } else {
        // Non-batched transactions
        await sendSingleTransactions({
          sendCallAsync,
          transactions: resolvedTransactions,
          transactionType,
          writeContractAsync,
        });
      }
    },
    [
      writeContractsAsync,
      writeContractAsync,
      sendCallsAsync,
      sendCallAsync,
      capabilities,
      transactionType,
      walletCapabilities,
    ],
  );
};
