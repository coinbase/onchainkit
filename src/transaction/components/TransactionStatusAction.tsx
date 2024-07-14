import { useMemo } from 'react';
import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import type { TransactionStatusActionReact } from '../types';

export function TransactionStatusAction({
  className,
}: TransactionStatusActionReact) {
  const { errorMessage, isLoading, transactionId } = useTransactionContext();

  // TODO: rethink ordering and add additional cases
  const actionElement = useMemo(() => {
    if (isLoading) {
      return (
        <a>
          <span className={cn(text.label1, color.primary)}>
            View on explorer
          </span>
        </a>
      );
    }
    if (transactionId) {
      return (
        <a href={`https://basescan.org/tx/${transactionId}`} target="_blank">
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      );
    }
    if (errorMessage) {
      return (
        <button>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      );
    }
    return null;
  }, [isLoading]);

  return <div className={cn(text.label2, className)}>{actionElement}</div>;
}
