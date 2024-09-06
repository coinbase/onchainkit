import { useCallback } from 'react';
import type { ContractFunctionParameters } from 'viem';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { Config } from 'wagmi';
import type {
  SendTransactionMutateAsync,
  WriteContractMutateAsync,
} from 'wagmi/query';
import type { Call, WalletCapabilities } from '../types';
import type { WalletCapabilities as OCKWalletCapabilities } from '../../types';

export const useSendWalletTransactions = ({
  transactions,
  transactionType,
  capabilities,
  writeContractsAsync,
  writeContractAsync,
  sendCallsAsync,
  sendCallAsync,
  walletCapabilities,
}: {
  transactions: Call[] | ContractFunctionParameters[];
  transactionType: string;
  capabilities?: WalletCapabilities;
  // biome-ignore lint: cannot find module 'wagmi/experimental/query'
  writeContractsAsync: any;
  writeContractAsync?: WriteContractMutateAsync<Config, unknown> | (() => void);
  // biome-ignore lint: cannot find module 'wagmi/experimental/query'
  sendCallsAsync: any;
  sendCallAsync?: SendTransactionMutateAsync<Config, unknown> | (() => void);
  walletCapabilities: OCKWalletCapabilities;
}) => {
  return useCallback(async () => {
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
          await sendCallAsync?.(transaction as Call);
        } else {
          await writeContractAsync?.(transaction as ContractFunctionParameters);
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
  ]);
};
