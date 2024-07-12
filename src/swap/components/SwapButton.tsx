import { background, cn, pressable, text } from '../../styles/theme';
import { Spinner } from '../../internal/loading/Spinner';
import { useSwapContext } from './SwapProvider';
import type { SwapButtonReact } from '../types';

export function SwapButton({
  className,
  disabled = false,
  onError,
  onSuccess,
}: SwapButtonReact) {
  const { to, from, loading, isTransactionPending, handleSubmit } =
    useSwapContext();

  const isLoading =
    to.loading || from.loading || loading || isTransactionPending;

  const isDisabled =
    !from.amount ||
    !from.token ||
    !to.amount ||
    !to.token ||
    disabled ||
    isLoading;

  return (
    <button
      type="button"
      className={cn(
        background.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        isDisabled && pressable.disabled,
        text.headline,
        className,
      )}
      onClick={() => handleSubmit(onError, onSuccess)}
      disabled={isDisabled}
      data-testid="ockSwapButton_Button"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, 'text-inverse')}>Swap</span>
      )}
    </button>
  );
}
