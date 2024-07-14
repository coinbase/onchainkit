import { useMemo } from 'react';
import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import type { TransactionStatusLabelReact } from '../types';

export function TransactionStatusLabel({
  className,
}: TransactionStatusLabelReact) {
  const { errorMessage, isLoading, transactionId } = useTransactionContext();

  // TODO: rethink ordering and add additional cases
  const label = useMemo(() => {
    if (isLoading) {
      return 'Transaction in progress...';
    }
    if (transactionId) {
      return 'Successful!';
    }
    if (errorMessage) {
      return 'Something went wrong. Please try again.';
    }
    return 'Complete the required fields to continue';
  }, [isLoading]);

  const labelClassName = useMemo(() => {
    if (errorMessage) {
      return color.error;
    }
    return color.foregroundMuted;
  }, []);

  return (
    <div className={cn(text.label2, className)}>
      <p className={labelClassName}>{label}</p>
    </div>
  );
}
