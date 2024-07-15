import { ReactNode, useMemo } from 'react';
import { useTransactionContext } from '../components/TransactionProvider';
import { cn, color, text } from '../../styles/theme';

export function useGetTransactionStatus() {
  const { errorMessage, isLoading, transactionId } = useTransactionContext();

  return useMemo(() => {
    let actionElement: ReactNode = null;
    let label = 'Complete the required fields to continue';
    let labelClassName: string = color.foregroundMuted;

    if (isLoading) {
      label = 'Transaction in progress...';
      actionElement = (
        <a>
          <span className={cn(text.label1, color.primary)}>
            View on explorer
          </span>
        </a>
      );
    }
    if (transactionId) {
      label = 'Successful!';
      actionElement = (
        <a href={`https://basescan.org/tx/${transactionId}`} target="_blank">
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      );
    }
    if (errorMessage) {
      label = 'Something went wrong. Please try again.';
      labelClassName = color.error;
      actionElement = (
        <button>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      );
    }

    return { actionElement, label, labelClassName };
  }, [errorMessage, isLoading, transactionId]);
}
