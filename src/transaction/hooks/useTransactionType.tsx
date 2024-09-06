import { useMemo } from 'react';
import type { ContractFunctionParameters } from 'viem';
import type { WalletCapabilities } from '../../types';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { Call } from '../types';

export const useTransactionType = ({
  calls,
  contracts,
  transactionStatuses,
  walletCapabilities,
}: {
  calls?: Call[];
  contracts?: ContractFunctionParameters[];
  transactionStatuses: {
    [TRANSACTION_TYPE_CALLS]: {
      single: string;
      batch: string;
    };
    [TRANSACTION_TYPE_CONTRACTS]: {
      single: string;
      batch: string;
    };
  };
  walletCapabilities: WalletCapabilities;
}) => {
  return useMemo(() => {
    const transactionType =
      calls || !contracts ? TRANSACTION_TYPE_CALLS : TRANSACTION_TYPE_CONTRACTS;

    const singleOrBatched = walletCapabilities.hasAtomicBatch
      ? 'batch'
      : 'single';
    const transactionStatus =
      transactionStatuses[transactionType][singleOrBatched];

    return {
      transactionType,
      transactionStatus,
    };
  }, [
    calls,
    contracts,
    transactionStatuses,
    walletCapabilities.hasAtomicBatch,
  ]);
};
