import type { SwapButtonReact, SwapError } from '../types';
import { SwapContext } from '../context';
import { TextHeadline } from '../../internal/text';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { cn } from '../../utils/cn';
import { isSwapError } from '../core/isSwapError';
import { useCallback, useContext } from 'react';

export function SwapButton({ onError, onSubmit }: SwapButtonReact) {
  const { address, fromAmount, fromToken, toToken } = useContext(SwapContext);

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
          onError?.(response);
        } else {
          onSubmit?.(response);
        }
      } catch (error) {
        onError?.(error as SwapError);
      }
    }
  }, [address, fromAmount, fromToken, toToken]);

  return (
    <button
      className={cn(
        'w-full rounded-xl bg-indigo-600',
        'px-4 py-3 font-medium text-base text-white leading-6 mt-4',
      )}
      onClick={handleSubmit}
      disabled={!fromAmount || !fromToken || !toToken}
    >
      <TextHeadline color="white">Swap</TextHeadline>
    </button>
  );
}
