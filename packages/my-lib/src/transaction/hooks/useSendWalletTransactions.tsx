import { useCallback } from 'react';
import type { ContractFunctionParameters } from 'viem';
import { useConfig } from 'wagmi';
import { Capabilities } from '../../core/constants';
import type { Call, UseSendWalletTransactionsParams } from '../types';
import { sendBatchedTransactions } from '../utils/sendBatchedTransactions';
import { sendSingleTransactions } from '../utils/sendSingleTransactions';

/**
 * Sends transactions to the wallet using the appropriate hook based on Transaction props and wallet capabilities
 */
export const useSendWalletTransactions = ({
  capabilities,
  sendCallAsync,
  sendCallsAsync,
  walletCapabilities,
}: UseSendWalletTransactionsParams) => {
  const config = useConfig();
  return useCallback(
    async (
      transactions?:
        | Call[]
        | ContractFunctionParameters[]
        | Promise<Call[]>
        | Promise<ContractFunctionParameters[]>
        | Array<Call | ContractFunctionParameters>,
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
          config,
          sendCallAsync,
          transactions: resolvedTransactions,
        });
      }
    },
    [sendCallsAsync, sendCallAsync, capabilities, walletCapabilities, config],
  );
};
