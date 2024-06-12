import { useCallback, useContext, useEffect, useMemo } from 'react';

import { isValidAmount } from '../utils';
import { TokenChip } from '../../token';
import { SwapContext } from '../context';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInputV2({ amount, label, setAmount, token, type }: SwapAmountInputReact) {
  const { fromAmount, setFromAmount, setFromToken, setToAmount, setToToken, toAmount } =
    useContext(SwapContext);

  const contextAmount = useMemo(() => {
    if (type === 'to') {
      return toAmount;
    }
    return fromAmount;
  }, [type, toAmount, fromAmount]);

  const setContextAmount = useMemo(() => {
    if (type === 'to') {
      return setToAmount;
    }
    return setFromAmount;
  }, [type, setToAmount, setFromAmount]);

  const setContextToken = useMemo(() => {
    if (type === 'to') {
      return setToToken;
    }
    return setFromToken;
  }, [type, setFromToken, setToToken]);

  useEffect(() => {
    if (token) {
      setContextToken(token);
    }
  }, [token]);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidAmount(event.target.value)) {
      setContextAmount?.(event.target.value);
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
        <TokenChip token={token} />
      </div>
      <input
        className="w-full border-[none] bg-transparent text-5xl text-[black]"
        data-testid="ockSwapAmountInput_Input"
        onChange={handleAmountChange}
        placeholder="0"
        value={amount || contextAmount}
      />
    </div>
  );
}
