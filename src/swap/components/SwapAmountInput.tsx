import { useCallback, useContext, useEffect, useMemo } from 'react';

import { isValidAmount } from '../utils';
import { TokenChip } from '../../token';
import { cn } from '../../utils/cn';
import { SwapContext } from '../context';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInput({ label, token, type }: SwapAmountInputReact) {
  const {
    fromAmount,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    toAmount,
  } = useContext(SwapContext);

  /* istanbul ignore next */
  const amount = useMemo(() => {
    if (type === 'to') {
      return toAmount;
    }
    return fromAmount;
  }, [type, toAmount, fromAmount]);

  /* istanbul ignore next */
  const setAmount = useMemo(() => {
    if (type === 'to') {
      return setToAmount;
    }
    return setFromAmount;
  }, [type, setToAmount, setFromAmount]);

  /* istanbul ignore next */
  const setToken = useMemo(() => {
    if (type === 'to') {
      return setToToken;
    }
    return setFromToken;
  }, [type, setFromToken, setToToken]);

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidAmount(event.target.value)) {
        setAmount?.(event.target.value);
      }
    },
    [setAmount],
  );

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);

  return (
    <div
      className={cn(
        'box-border flex w-full flex-col items-start',
        'gap-[11px] border-b border-solid bg-[#FFF] p-4',
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <label className="font-semibold text-[#030712] text-sm">{label}</label>
      </div>
      <div className="flex w-full items-center justify-between">
        <TokenChip token={token} />
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
