import { useCallback } from 'react';
import type { SwapButtonReact, SwapError } from '../types';
import { useSwapContext } from '../context';
import { TextHeadline } from '../../internal/text';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { cn } from '../../utils/cn';
import { isSwapError } from '../core/isSwapError';

export function SwapButton({ disabled = false, onSubmit }: SwapButtonReact) {
  const { address, fromAmount, fromToken, toToken, setError } =
    useSwapContext();

  const handleSubmit = useCallback(async () => {
    if (address && fromToken && toToken && fromAmount) {
      try {
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
      }
    }
  }, [address, fromAmount, fromToken, setError, onSubmit, toToken]);

  return (
    <button
      type="button"
      className={cn(
        'w-full rounded-xl bg-indigo-600',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        disabled ? 'opacity-[0.38]' : '',
      )}
      onClick={handleSubmit}
      disabled={!fromAmount || !fromToken || !toToken || disabled}
    >
      <TextHeadline color="inverse">Swap</TextHeadline>
    </button>
  );
}
