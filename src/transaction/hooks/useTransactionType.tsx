import { useMemo } from 'react';
import {
  TRANSACTION_TYPE_CALLS,
  TRANSACTION_TYPE_CONTRACTS,
} from '../constants';
import type { UseTransactionTypeParams } from '../types';

// In the `Transaction` component either `calls` and `contracts` can be passed as props for transactions.
// This hook is used to determine the transaction type based on the props passed.
// It will also return the appropriate transaction status based on the transaction type.
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
