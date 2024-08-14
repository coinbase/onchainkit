import { useCallback } from 'react';
import type { ContractFunctionParameters } from 'viem';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { CallsType, WalletCapabilities } from '../types';

export const useSendSCWTransactions = ({
  transactionType,
  contracts,
  calls,
  capabilities,
  writeContractsAsync,
  sendCallsAsync,
}: {
  transactionType: string;
  contracts?: ContractFunctionParameters[];
  calls?: CallsType[];
  capabilities?: WalletCapabilities;
  // biome-ignore lint: cannot find module 'wagmi/experimental/query'
  writeContractsAsync: any;
  // biome-ignore lint: cannot find module 'wagmi/experimental/query'
  sendCallsAsync: any;
}) => {
  return useCallback(async () => {
    if (transactionType === TRANSACTION_TYPE_CONTRACTS && contracts) {
      await writeContractsAsync({
        contracts,
        capabilities,
      });
    }
    if (transactionType === TRANSACTION_TYPE_CALLS && calls) {
      await sendCallsAsync({
        calls,
        capabilities,
      });
    }
  }, [
    writeContractsAsync,
    sendCallsAsync,
    calls,
    contracts,
    capabilities,
    transactionType,
  ]);
};
