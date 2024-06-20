import { useCallback } from 'react';
import { useSwapContext } from '../context';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { background, cn, pressable, text } from '../../styles/theme';
import { isSwapError } from '../core/isSwapError';
import { Spinner } from '../../internal/loading/Spinner';
import type { SwapButtonReact, SwapError } from '../types';

export function SwapButton({ disabled = false, onSubmit }: SwapButtonReact) {
  const {
    address,
    fromAmount,
    fromToken,
    toAmount,
    setError,
    setSwapLoadingState,
    swapLoadingState,
    toToken,
  } = useSwapContext();

  const handleSubmit = useCallback(async () => {
    if (address && fromToken && toToken && fromAmount) {
      try {
        setSwapLoadingState({ ...swapLoadingState, isSwapLoading: true });
        const response = await buildSwapTransaction({
          amount: fromAmount,
          fromAddress: address,
          from: fromToken,
          to: toToken,
        });
        if (isSwapError(response)) {
          setError(response);
        } else {
          onSubmit?.(response);
        }
      } catch (error) {
        setError(error as SwapError);
      } finally {
        setSwapLoadingState({ ...swapLoadingState, isSwapLoading: false });
      }
    }
  }, [
    address,
    fromAmount,
    fromToken,
    onSubmit,
    setError,
    setSwapLoadingState,
    swapLoadingState,
    toToken,
  ]);

  const isDisabled =
    !fromAmount ||
    !fromToken ||
    !toAmount ||
    !toToken ||
    disabled ||
    swapLoadingState?.isSwapLoading;

  return (
    <button
      type="button"
      className={cn(
        background.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        isDisabled && !swapLoadingState?.isSwapLoading && pressable.disabled,
      )}
      onClick={handleSubmit}
      disabled={isDisabled}
    >
      {swapLoadingState?.isSwapLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, 'text-inverse')}>Swap</span>
      )}
    </button>
  );
}
