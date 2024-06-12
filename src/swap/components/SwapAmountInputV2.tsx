import { useCallback, useContext, useMemo } from 'react';

import { isValidAmount } from '../utils';
import { TokenChip } from '../../token';
import { SwapContext } from '../context';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInputV2({ label, token, type }: SwapAmountInputReact) {
  const { fromAmount, setFromAmount, toAmount, setToAmount } = useContext(SwapContext);

  const amount: string = useMemo(() => {
    if (type === 'to') {
      return toAmount;
    }
    return fromAmount;
  }, [type, toAmount, fromAmount]);

  const setAmount: (a: string) => void = useMemo(() => {
    if (type === 'to') {
      return setToAmount;
    }
    return setFromAmount;
  }, [type, setToAmount, setFromAmount]);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidAmount(event.target.value)) {
      setAmount?.(event.target.value);
    }
  }, []);

  return (
    <div
      className="box-border flex w-full flex-col items-start gap-[11px] border-b border-solid  bg-[#FFF] p-4"
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <label className="text-sm font-semibold text-[#030712]">{label}</label>
      </div>
      <div className="flex w-full items-center justify-between">
        {token && <TokenChip token={token} />}
      </div>
      <input
        className="w-full border-[none] bg-transparent text-5xl text-[black]"
        data-testid="ockSwapAmountInput_Input"
        onChange={handleAmountChange}
        placeholder="0"
        value={amount}
      />
    </div>
  );
}
