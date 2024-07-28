import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useChainId } from 'wagmi';
import { Spinner } from '../../internal/components/Spinner';
import { errorSvg } from '../../internal/svg/errorSvg';
import { successSvg } from '../../internal/svg/successSvg';
import { getChainExplorer } from '../../network/getChainExplorer';
import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

export function useGetTransactionToast() {
  const {
    chainId,
    errorMessage,
    isLoading,
    onSubmit,
    receipt,
    transactionHash,
    transactionId,
  } = useTransactionContext();
  const accountChainId = chainId ?? useChainId();

  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  return useMemo(() => {
    const chainExplorer = getChainExplorer(accountChainId);

    let actionElement: ReactNode = null;
    let label = '';
    let icon: ReactNode = null;

    if (isInProgress) {
      icon = <Spinner className="px-1.5 py-1.5" />;
      label = 'Transaction in progress';
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
      icon = successSvg;
      label = 'Successful';
    }
    if (errorMessage) {
      actionElement = (
        <button type="button" onClick={onSubmit}>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      );
      icon = errorSvg;
      label = 'Something went wrong';
    }

    return { actionElement, icon, label };
  }, [
    accountChainId,
    errorMessage,
    isInProgress,
    onSubmit,
    receipt,
    transactionHash,
  ]);
}
