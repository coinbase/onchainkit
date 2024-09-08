import { useMemo } from 'react';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { UseTransactionTypeParams } from '../types';

export const useTransactionType = ({
  calls,
  contracts,
  transactionStatuses,
  walletCapabilities,
}: UseTransactionTypeParams) => {
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
