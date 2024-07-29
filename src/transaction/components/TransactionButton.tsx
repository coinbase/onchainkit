import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';
import { background, cn, pressable, text } from '../../styles/theme';
import type { TransactionButtonReact } from '../types';
import { isSpinnerDisplayed } from '../utils';
import { useTransactionContext } from './TransactionProvider';

export function TransactionButton({
  className,
  disabled = false,
  text: buttonText = 'Transact',
}: TransactionButtonReact) {
  const {
    address,
    contracts,
    errorMessage,
    isLoading,
    onSubmit,
    receipt,
    statusWriteContract,
    statusWriteContracts,
    transactionHash,
    transactionId,
  } = useTransactionContext();

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
      return checkmarkSvg;
    }
    return buttonText;
  }, [buttonText, receipt]);

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
      onClick={onSubmit}
      type="button"
      disabled={isDisabled}
    >
      {displaySpinner ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, 'flex justify-center text-inverse')}>
          {buttonContent}
        </span>
      )}
    </button>
  );
}
