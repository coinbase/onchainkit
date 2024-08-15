import { useMemo } from 'react';
import { color } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

export function useGetTransactionToastLabel() {
  const { errorMessage, isLoading, receipt, transactionHash, transactionId } =
    useTransactionContext();

  // user confirmed in wallet, txn in progress
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  return useMemo(() => {
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (isInProgress) {
      label = 'Transaction in progress';
    }

    if (receipt) {
      label = 'Successful';
    }

    if (errorMessage) {
      label = 'Something went wrong';
      labelClassName = color.error;
    }

    return { label, labelClassName };
  }, [errorMessage, isInProgress, receipt]);
}
