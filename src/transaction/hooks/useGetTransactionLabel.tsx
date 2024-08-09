import { useMemo } from 'react';
import { color } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

type UseGetTransactionLabelParams = {
  context: 'toast' | 'status';
};
export function useGetTransactionLabel({
  context,
}: UseGetTransactionLabelParams) {
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
  const isToast = context === 'toast';

  return useMemo(() => {
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (isPending) {
      label = 'Confirm in wallet.';
    }

    if (isInProgress) {
      label = isToast
        ? 'Transaction in progress'
        : 'Transaction in progress...';
    }

    if (receipt) {
      label = 'Successful';
    }

    if (errorMessage) {
      label = isToast ? 'Something went wrong' : errorMessage;
      labelClassName = color.error;
    }

    return { label, labelClassName };
  }, [errorMessage, isInProgress, isPending, isToast, receipt]);
}
