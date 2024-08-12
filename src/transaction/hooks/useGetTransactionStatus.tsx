import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useChainId } from 'wagmi';
import { getChainExplorer } from '../../network/getChainExplorer';
import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

export function useGetTransactionStatus() {
  const {
    chainId,
    errorMessage,
    isLoading,
    receipt,
    statusSingle,
    statusBatched,
    transactionHash,
    transactionId,
  } = useTransactionContext();
  const accountChainId = chainId ?? useChainId();
  const isPending = statusSingle === 'pending' || statusBatched === 'pending';
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  return useMemo(() => {
    const chainExplorer = getChainExplorer(accountChainId);

    let actionElement: ReactNode = null;
    let label = '';
    let labelClassName: string = color.foregroundMuted;

    if (isPending) {
      label = 'Confirm in wallet.';
    }

    if (isInProgress) {
      label = 'Transaction in progress...';
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
    }

    if (receipt) {
      label = 'Successful!';
    }

    if (errorMessage) {
      label = errorMessage;
      labelClassName = color.error;
    }

    return { actionElement, label, labelClassName };
  }, [
    accountChainId,
    errorMessage,
    isInProgress,
    isPending,
    receipt,
    transactionHash,
  ]);
}
