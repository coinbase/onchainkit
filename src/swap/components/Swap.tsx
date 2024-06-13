import { useCallback, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { SwapContext } from '../context';
import type { SwapError, SwapReact } from '../types';
import type { Token } from '../../token';
import { getSwapQuote } from '../core/getSwapQuote';
import { isSwapError } from '../utils';

export function Swap({ account, children, onError }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();

  const handleToAmountChange = useCallback(
    async (amount: string) => {
      setToAmount(amount);
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        const response = await getSwapQuote({
          from: fromToken,
          to: toToken,
          amount,
          amountReference: 'to',
        });
        if (isSwapError(response)) {
          onError?.(response);
          return;
        }
        setFromAmount(response?.fromAmount);
      } catch (error) {
        onError?.(error as SwapError);
      }
    },
    [fromToken, toToken, setFromAmount, setToAmount],
  );

  const handleFromAmountChange = useCallback(
    async (amount: string) => {
      setFromAmount(amount);
      const hasRequiredFields = fromToken && toToken && amount;
      if (!hasRequiredFields) {
        return;
      }
      try {
        const response = await getSwapQuote({
          from: fromToken,
          to: toToken,
          amount,
          amountReference: 'from',
        });
        if (isSwapError(response)) {
          onError?.(response);
          return;
        }
        setToAmount(response?.toAmount);
      } catch (error) {
        onError?.(error as SwapError);
      }
    },
    [fromToken, toToken, setFromAmount, setToAmount],
  );

  const value = useMemo(() => {
    return {
      account,
      fromAmount,
      fromToken,
      setFromAmount: handleFromAmountChange,
      setFromToken,
      setToAmount: handleToAmountChange,
      setToToken,
      toAmount,
      toToken,
    };
  }, [
    account,
    fromAmount,
    fromToken,
    handleFromAmountChange,
    handleToAmountChange,
    setFromToken,
    setToAmount,
    setToToken,
    toAmount,
    toToken,
  ]);

  return (
    <SwapContext.Provider value={value}>
      <div className="flex w-[400px] flex-col rounded-xl bg-white">
        <label
          className={cn(
            'box-border w-full border-b border-solid  p-4 text-base',
            'font-semibold leading-6 text-[#030712]',
          )}
        >
          Swap
        </label>
        {children}
      </div>
    </SwapContext.Provider>
  );
}
