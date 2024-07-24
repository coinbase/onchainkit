import { Spinner } from '../../internal/components/Spinner';
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
    status,
    transactionHash,
    transactionId,
  } = useTransactionContext();

  const isDisabled = isLoading || !contracts || !address || transactionId;

  const displaySpinner = isSpinnerDisplayed({
    errorMessage,
    isLoading,
    status,
    transactionHash,
    transactionId,
  });

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
        <span className={cn(text.headline, 'text-inverse')}>{buttonText}</span>
      )}
    </button>
  );
}
