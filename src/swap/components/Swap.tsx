import { useMemo, useState } from 'react';
import type { SwapReact } from '../types';
import { SwapContext } from '../context';

export function Swap({ account, children }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const value = useMemo(() => {
    return {
      fromAmount,
      setFromAmount,
      toAmount,
      setToAmount,
      account,
    };
  }, [account, fromAmount, setFromAmount, setToAmount, toAmount]);

  return (
    <SwapContext.Provider value={value}>
      <div className="flex w-[400px] flex-col rounded-xl bg-white">
        <label className="box-border w-full border-b border-solid  p-4 text-base font-semibold leading-6 text-[#030712] shadow-[0px_4px_4px_0px_rgba(3,7,18,0.05)]">
          Swap
        </label>
        {children}
      </div>
    </SwapContext.Provider>
  );
}
