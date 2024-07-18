import { useMemo } from 'react';
import { useTransactionContext } from '../components/TransactionProvider';
import { cn, color, text } from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';
import { getChainExplorer } from '../../network/getChainExplorer';
import type { ReactNode } from 'react';

export function useGetTransactionStatus() {
  const { errorMessage, isLoading, onSubmit, transactionHash } =
    useTransactionContext();
  const { chain } = useOnchainKit();

  return useMemo(() => {
    const chainExplorer = getChainExplorer(chain.id);

    let actionElement: ReactNode = null;
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (isLoading) {
      label = 'Transaction in progress...';
      // TODO: add back when have correct link
      // actionElement = (
      //   <a href={chainExplorer}>
      //     <span className={cn(text.label1, color.primary)}>
      //       View on explorer
      //     </span>
      //   </a>
      // );
    }
    if (transactionHash) {
      label = 'Successful!';
      actionElement = (
        <a
          href={`${chainExplorer}/tx/${transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      );
    }
    if (errorMessage) {
      label = errorMessage;
      labelClassName = color.error;
      actionElement = (
        <button type="button" onClick={onSubmit}>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      );
    }

    return { actionElement, label, labelClassName };
  }, [chain, errorMessage, isLoading, transactionHash]);
}
