import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';
import { background, cn, pressable, text } from '../../styles/theme';
import type { TransactionButtonReact } from '../types';
import { isSpinnerDisplayed } from '../utils';
import { useTransactionContext } from './TransactionProvider';

export function TransactionButton({
  className,
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

  const isDisabled =
    !receipt &&
    (isLoading ||
      !contracts ||
      !address ||
      transactionId ||
      statusWriteContract === 'pending' ||
      statusWriteContracts === 'pending');

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
    >
      {displaySpinner ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, 'flex text-inverse justify-center')}>
          {buttonContent}
        </span>
      )}
    </button>
  );
}
