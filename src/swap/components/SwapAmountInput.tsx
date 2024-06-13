import { useCallback, useContext, useEffect, useMemo } from 'react';

import { isValidAmount } from '../../utils/isValidAmount';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { TokenChip } from '../../token';
import { cn } from '../../utils/cn';
import { SwapContext } from '../context';
import { useBalance } from 'wagmi';
import type { UseBalanceReturnType } from 'wagmi';
import type { SwapAmountInputReact } from '../types';

export function SwapAmountInput({ label, token, type }: SwapAmountInputReact) {
  const {
    address,
    fromAmount,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    toAmount,
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

  const balanceResponse: UseBalanceReturnType = useBalance({
    address,
    ...(token?.address && { token: token.address }),
  });

  const roundedBalance = useMemo(() => {
    if (balanceResponse?.data?.formatted && token?.address) {
      return getRoundedAmount(balanceResponse?.data?.formatted, 8);
    }
  }, [balanceResponse?.data]);

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isValidAmount(event.target.value)) {
        setAmount?.(event.target.value);
      }
    },
    [setAmount],
  );

  const handleMaxButtonClick = useCallback(() => {
    if (balanceResponse?.data?.formatted) {
      setAmount?.(balanceResponse?.data?.formatted);
    }
  }, [balanceResponse?.data, setAmount]);

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
        {roundedBalance && (
          <label className="font-normal text-gray-400 text-sm">{`Balance: ${roundedBalance}`}</label>
        )}
      </div>
      <div className="flex w-full items-center justify-between">
        <TokenChip token={token} />
        {type === 'from' && (
          <button
            className={cn(
              'flex h-8 w-[58px] max-w-[200px] items-center rounded-[40px]',
              'bg-gray-100 px-3 py-2 font-medium text-base',
              'text-gray-500 not-italic leading-6',
            )}
            data-testid="ockSwapAmountInput_MaxButton"
            disabled={roundedBalance === undefined}
            onClick={handleMaxButtonClick}
          >
            Max
          </button>
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
