import { useCallback, useContext } from 'react';
import { SwapContext } from '../context';
import { SwapButtonReact } from '../types';

export function SwapButton({ onSubmit }: SwapButtonReact) {
  const { onSubmit: onSubmitSwap } = useContext(SwapContext);

  const handleSubmit = useCallback(() => {
    onSubmitSwap();
    onSubmit?.();
  }, []);

  return (
    <div className="w-full p-4">
      <button
        className="w-full rounded-[100px] bg-blue-700 px-4 py-3 text-base font-medium leading-6 text-white"
        onClick={handleSubmit}
      >
        Swap
      </button>
    </div>
  );
}
