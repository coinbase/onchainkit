import { useCallback, useContext } from 'react';
import { cn } from '../../lib/utils';
import { SwapContext } from '../context';
import type { SwapButtonReact } from '../types';

export function SwapButton({ onSubmit }: SwapButtonReact) {
  const {
    onSubmit: onSubmitSwap,
    fromAmount,
    fromToken,
    toAmount,
    toToken,
  } = useContext(SwapContext);

  const handleSubmit = useCallback(() => {
    onSubmitSwap();
    onSubmit?.();
  }, [onSubmit, onSubmitSwap]);

  return (
    <div className="w-full p-4">
      <button
        className={cn(
          'w-full rounded-[100px] bg-blue-700',
          'px-4 py-3 text-base font-medium leading-6 text-white',
        )}
        onClick={handleSubmit}
        disabled={!fromAmount || !fromToken || !toAmount || !toToken}
      >
        Swap
      </button>
    </div>
  );
}
