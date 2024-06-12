import { useCallback, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { SwapContext } from '../context';
import { useGetSwapQuote } from '../hooks/useGetSwapQuote';
import type { SwapReact } from '../types';
import type { Token } from '../../token';

export function Swap({ account, children, onError }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [lastTokenAmountUpdated, setLastTokenAmountUpdated] = useState<'to' | 'from' | undefined>();

  useGetSwapQuote({
    amountReference: lastTokenAmountUpdated,
    fromAmount,
    fromToken,
    onError,
    onSuccess: () => setLastTokenAmountUpdated(undefined),
    setToAmount,
    setFromAmount,
    toAmount,
    toToken,
  });

  const handleToAmountChange = useCallback(
    (amount: string) => {
      if (lastTokenAmountUpdated !== 'to') {
        setLastTokenAmountUpdated('to');
      }
      setToAmount(amount);
    },
    [lastTokenAmountUpdated, setLastTokenAmountUpdated, setToAmount],
  );

  const handleFromAmountChange = useCallback(
    (amount: string) => {
      if (lastTokenAmountUpdated !== 'from') {
        setLastTokenAmountUpdated('from');
      }
      setFromAmount(amount);
    },
    [lastTokenAmountUpdated, setFromAmount, setLastTokenAmountUpdated],
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
