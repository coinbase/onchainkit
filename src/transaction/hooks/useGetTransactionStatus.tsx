import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { getChainExplorer } from '../../network/getChainExplorer';
import { cn, color, text } from '../../styles/theme';
import { useTransactionContext } from '../components/TransactionProvider';

export function useGetTransactionStatus() {
  const {
    chainId,
    errorMessage,
    isLoading,
    receipt,
    statusWriteContract,
    statusWriteContracts,
    transactionHash,
    transactionId,
  } = useTransactionContext();
  const accountChainId = chainId ?? useChainId();
  const isPending =
    statusWriteContract === 'pending' || statusWriteContracts === 'pending';
  const isInProgress = isLoading || !!transactionId || !!transactionHash;

  const { showCallsStatus } = useShowCallsStatus();

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

    if (receipt) {
      label = 'Successful!';
      actionElement = null;
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
    showCallsStatus,
    transactionHash,
    transactionId,
  ]);
}
