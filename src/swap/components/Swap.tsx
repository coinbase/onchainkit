import { useCallback, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { SwapContext } from '../context';
import type { SwapError, SwapReact } from '../types';
import type { Token } from '../../token';
import { useGetSwapQuote } from '../hooks/useGetSwapQuote';

export function Swap({ account, children, onError }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [swapQuoteError, setSwapQuoteError] = useState('');
  const [swapTransactionError, setSwapTransactionError] = useState('');
  const [lastTokenAmountUpdated, setLastTokenAmountUpdated] = useState<'to' | 'from' | undefined>();

  useGetSwapQuote({
    amountReference: lastTokenAmountUpdated,
    fromAmount,
    fromToken,
    onError: (response: SwapError) => {
      onError?.(response);
      setSwapQuoteError(response?.error);
    },
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
        {(swapQuoteError || swapTransactionError) && (
          <p className={cn('p-4 text-center text-[14px] text-[red]')}>
            {swapQuoteError || swapTransactionError}
          </p>
        )}
        {children}
      </div>
    </SwapContext.Provider>
  );
}
