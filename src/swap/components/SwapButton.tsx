import { useCallback, useContext } from 'react';
import { cn } from '../../utils/cn';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { isSwapError } from '../utils';
import { SwapContext } from '../context';
import type { SwapButtonReact, SwapError } from '../types';

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
    <div className="w-full p-4">
      <button
        className={cn(
          'w-full rounded-[100px] bg-blue-700',
          'px-4 py-3 text-base font-medium leading-6 text-white',
        )}
        onClick={handleSubmit}
        disabled={!fromAmount || !fromToken || !toToken}
      >
        Swap
      </button>
    </div>
  );
}
