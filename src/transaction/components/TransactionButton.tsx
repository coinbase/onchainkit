import { useCallback, useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { background, cn, color, pressable, text } from '../../styles/theme';
import type { TransactionButtonReact } from '../types';
import { isSpinnerDisplayed } from '../utils/isSpinnerDisplayed';
import { useTransactionContext } from './TransactionProvider';
import { useShowCallsStatus } from 'wagmi/experimental';
import { useChainId } from 'wagmi';
import { getChainExplorer } from '../../network/getChainExplorer';

export function TransactionButton({
  className,
  disabled = false,
  text: buttonText = 'Transact',
}: TransactionButtonReact) {
  const {
    address,
    contracts,
    chainId,
    errorMessage,
    isLoading,
    onSubmit,
    receipt,
    statusWriteContract,
    statusWriteContracts,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const accountChainId = chainId ?? useChainId();
  const { showCallsStatus } = useShowCallsStatus();

  const isInProgress =
    statusWriteContract === 'pending' ||
    statusWriteContracts === 'pending' ||
    isLoading;
  const isMissingProps = !contracts || !address;
  const isWaitingForReceipt = !!transactionId || !!transactionHash;

  const isDisabled =
    !receipt &&
    (isInProgress || isMissingProps || isWaitingForReceipt || disabled);

  const displaySpinner = isSpinnerDisplayed({
    errorMessage,
    hasReceipt: !!receipt,
    isLoading,
    statusWriteContract,
    statusWriteContracts,
    transactionHash,
    transactionId,
  });

  const buttonContent = useMemo(() => {
    if (receipt) {
      return 'View transaction';
    }
    if (errorMessage) {
      return 'Try again';
    }
    return buttonText;
  }, [buttonText, errorMessage, receipt]);

  const handleSubmit = useCallback(() => {
    if (receipt && transactionId) {
      showCallsStatus({ id: transactionId });
    } else if (receipt) {
      const chainExplorer = getChainExplorer(accountChainId);
      window.open(
        `${chainExplorer}/tx/${transactionHash}`,
        '_blank',
        'noopener,noreferrer',
      );
    } else {
      onSubmit();
    }
  }, [accountChainId, receipt, transactionHash, transactionId]);

  return (
    <button
      className={cn(
        background.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        className,
      )}
      onClick={handleSubmit}
      type="button"
      disabled={isDisabled}
    >
      {displaySpinner ? (
        <Spinner />
      ) : (
        <span
          className={cn(text.headline, color.inverse, 'flex justify-center')}
        >
          {buttonContent}
        </span>
      )}
    </button>
  );
}
