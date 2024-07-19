import { background, cn, pressable, text } from '../../styles/theme';
import { useTransactionContext } from './TransactionProvider';
import { Spinner } from '../../internal/components/Spinner';
import type { TransactionButtonReact } from '../types';

export function TransactionButton({
  className,
  text: buttonText = 'Transact',
}: TransactionButtonReact) {
  const { address, contracts, isLoading, onSubmit, transactionId } =
    useTransactionContext();

  // TODO: should disable if transactionId exists ?
  const isDisabled = isLoading || !contracts || !address || transactionId;

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
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, 'text-inverse')}>{buttonText}</span>
      )}
    </button>
  );
}
