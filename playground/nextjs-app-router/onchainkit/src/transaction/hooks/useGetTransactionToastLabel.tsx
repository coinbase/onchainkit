import { useMemo } from 'react';
import { color } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

export function useGetTransactionToastLabel() {
  const {
    errorMessage,
    isLoading,
    lifecycleStatus,
    receipt,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  // user confirmed in wallet, txn in progress
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  // waiting for calls or contracts promise to resolve
  const isBuildingTransaction =
    lifecycleStatus.statusName === 'buildingTransaction';

  return useMemo(() => {
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (isBuildingTransaction) {
      label = 'Building transaction';
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
  }, [errorMessage, isBuildingTransaction, isInProgress, receipt]);
}
