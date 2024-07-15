import { ReactNode, useMemo } from 'react';
import { useTransactionContext } from '../components/TransactionProvider';
import { cn, color, text } from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';
import { getChainExplorer } from './getChainExplorer';

export function useGetTransactionStatus() {
  const { errorMessage, isLoading, transactionId } = useTransactionContext();
  const { chain } = useOnchainKit();

  return useMemo(() => {
    const chainExplorer = getChainExplorer(chain.id);

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
        <a href={`${chainExplorer}/tx/${transactionId}`} target="_blank">
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
  }, [chain, errorMessage, isLoading, transactionId]);
}
