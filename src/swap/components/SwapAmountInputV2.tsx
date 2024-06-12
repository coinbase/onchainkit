import { useCallback, useContext, useMemo } from 'react';

import { isValidAmount } from '../utils';
import { TokenChip, TokenSelectDropdown } from '../../token';
import { SwapContext } from '../context';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInputV2({ label, swappableTokens, type }: SwapAmountInputReact) {
  const {
    fromAmount,
    fromToken,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    toAmount,
    toToken,
  } = useContext(SwapContext);

  const amount = useMemo(() => {
    if (type === 'to') {
      return toAmount;
    }
    return fromAmount;
  }, [type, toAmount, fromAmount]);

  const setAmount = useMemo(() => {
    if (type === 'to') {
      return setToAmount;
    }
    return setFromAmount;
  }, [type, setToAmount, setFromAmount]);

  const setToken = useMemo(() => {
    if (type === 'to') {
      return setToToken;
    }
    return setFromToken;
  }, [type, setFromToken, setToToken]);

  const token = useMemo(() => {
    if (type === 'to') {
      return toToken;
    }
    return fromToken;
  }, [type, fromToken, toToken]);

  const handleAmountChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidAmount(event.target.value)) {
      console.log(event.target.value);
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
        {token && !swappableTokens ? (
          <TokenChip token={token} />
        ) : (
          <TokenSelectDropdown options={swappableTokens} setToken={setToken} token={token} />
        )}
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
