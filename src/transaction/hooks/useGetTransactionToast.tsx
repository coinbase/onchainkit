import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { getChainExplorer } from '../../network/getChainExplorer';
import { cn, color, text } from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';
import { useTransactionContext } from '../components/TransactionProvider';
import { successSvg } from '../../internal/svg/successSvg';
import { errorSvg } from '../../internal/svg/errorSvg';
import type { ReactNode } from 'react';

export function useGetTransactionToast() {
  const { errorMessage, isLoading, onSubmit, status, transactionHash } =
    useTransactionContext();
  const { chain } = useOnchainKit();

  return useMemo(() => {
    const chainExplorer = getChainExplorer(chain.id);

    let actionElement: ReactNode = null;
    let label = '';
    let icon: ReactNode = null;

    if (isLoading) {
      // TODO: add back when have correct link
      // actionElement = (
      //   <a href={chainExplorer}>
      //     <span className={cn(text.label1, color.primary)}>
      //       View block explorer
      //     </span>
      //   </a>
      // );
      icon = <Spinner className="px-1.5 py-1.5" />;
      label = 'Transaction in progress';
    }
    if (status === 'success') {
      icon = successSvg;
      label = 'Successful';
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
  }, [chain, errorMessage, isLoading, onSubmit, status, transactionHash]);
}
