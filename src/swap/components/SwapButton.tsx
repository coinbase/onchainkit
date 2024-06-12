import { useCallback, useContext } from 'react';
import { cn } from '../../lib/utils';
import { SwapContext } from '../context';

export function SwapButton() {
  const { onSubmit, fromAmount, fromToken, toAmount, toToken } = useContext(SwapContext);

  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

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
