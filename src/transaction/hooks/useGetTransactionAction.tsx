import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { getChainExplorer } from '../../network/getChainExplorer';
import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

type UseGetTransactionActionParams = {
  context: 'toast' | 'status';
};

export function useGetTransactionAction({
  context,
}: UseGetTransactionActionParams) {
  const {
    chainId,
    errorMessage,
    onSubmit,
    receipt,
    transactionHash,
    transactionId,
  } = useTransactionContext();
  const accountChainId = chainId ?? useChainId();
  const isToast = context === 'toast';

  const { showCallsStatus } = useShowCallsStatus();

  return useMemo(() => {
    const chainExplorer = getChainExplorer(accountChainId);

    let actionElement: ReactNode = null;

    // EOA will have txn hash
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

    // SW will have txn id
    if (transactionId) {
      actionElement = (
        <button
          onClick={() => showCallsStatus({ id: transactionId })}
          type="button"
        >
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </button>
      );
    }

    if (receipt && !isToast) {
      actionElement = null;
    }

    if (errorMessage && isToast) {
      actionElement = (
        <button type="button" onClick={onSubmit}>
          <span className={cn(text.label1, color.primary)}>Try again</span>
        </button>
      );
    }

    return { actionElement };
  }, [
    accountChainId,
    errorMessage,
    isToast,
    onSubmit,
    receipt,
    showCallsStatus,
    transactionHash,
    transactionId,
  ]);
}
