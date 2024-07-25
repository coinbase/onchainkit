import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { getChainExplorer } from '../../network/getChainExplorer';
import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

export function useGetTransactionStatus() {
  const {
    chainId,
    errorMessage,
    isLoading,
    onSubmit,
    status,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  return useMemo(() => {
    const chainExplorer = getChainExplorer(chainId);

    let actionElement: ReactNode = null;
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (status === 'pending') {
      label = 'Confirm in wallet.';
    }

    if (isLoading || (transactionId && !transactionHash)) {
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
      label = 'Successful';
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
  }, [
    // chain
    chainId,
    errorMessage,
    isLoading,
    onSubmit,
    status,
    transactionHash,
    transactionId,
  ]);
}
