import { useCallback, useContext } from 'react';
import { SwapContext } from '../context';
import type { SwapButtonReact } from '../types';

export function SwapButton({ fromToken, onSubmit, toToken }: SwapButtonReact) {
  const { account, fromAmount } = useContext(SwapContext);

  const handleSubmit = useCallback(() => {
    if (account && fromToken && toToken && fromAmount) {
      onSubmit({ fromAddress: account.address, from: fromToken, to: toToken, amount: fromAmount });
    }
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
