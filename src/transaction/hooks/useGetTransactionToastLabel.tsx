import { useMemo } from 'react';
import { color } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

export function useGetTransactionToastLabel() {
  const {
    errorMessage,
    isLoading,
    receipt,
    statusWriteContract,
    statusWriteContracts,
    transactionHash,
    transactionId,
  } = useTransactionContext();
  const isInProgress = isLoading || !!transactionId || !!transactionHash;
  const isPending =
    statusWriteContract === 'pending' || statusWriteContracts === 'pending';

  return useMemo(() => {
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (isPending) {
      label = 'Confirm in wallet.';
    }

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
  }, [errorMessage, isInProgress, isPending, receipt]);
}
