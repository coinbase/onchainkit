import { Spinner } from '../../internal/components/Spinner';
import { background, cn, pressable, text } from '../../styles/theme';
import type { TransactionButtonReact } from '../types';
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

  // there is a delay between when txn is confirmed and
  // call status returns isLoading true so the third
  // condition here keeps spinner visible during that time
  const displaySpinner =
    isLoading ||
    status === 'pending' ||
    (transactionId && !transactionHash && !errorMessage);

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
