import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { getSwapQuote } from '../core/getSwapQuote';
import { SwapContext } from '../context';
import type { SwapError, SwapReact } from '../types';
import type { Token } from '../../token';
import { cn } from '../../lib/utils';

function isSwapError(response: unknown): response is SwapError {
  return response !== null && typeof response === 'object' && 'error' in response;
}

export function Swap({ account, children }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [swapQuoteError, setSwapQuoteError] = useState('');
  const [swapTransactionError, setSwapTransactionError] = useState('');

  const handleSubmit = useCallback(async () => {
    if (account && fromToken && toToken && fromAmount) {
      try {
        const response = await buildSwapTransaction({
          amount: fromAmount,
          fromAddress: account.address,
          from: fromToken,
          to: toToken,
        });
        if (isSwapError(response)) {
          setSwapTransactionError(response.error);
        } else {
          // TODO: complete
        }
      } catch (error) {
        console.log({ error });
      }
    }
  }, [account, fromAmount, fromToken, toToken]);

  const handleGetSwapQuote = useCallback(async () => {
    if (fromToken && toToken && fromAmount) {
      try {
        const response = await getSwapQuote({ from: fromToken, to: toToken, amount: fromAmount });
        if (isSwapError(response)) {
          setSwapQuoteError(response.error);
        } else {
          setToAmount(response?.toAmount);
        }
      } catch (error) {
        console.log({ error });
      }
    }
  }, [fromAmount, fromToken, toToken]);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      handleGetSwapQuote();
    }
  }, [fromAmount, fromToken, toToken]);

  const value = useMemo(() => {
    return {
      fromAmount,
      fromToken,
      onSubmit: handleSubmit,
      setFromAmount,
      setFromToken,
      setToAmount,
      setToToken,
      toAmount,
      toToken,
    };
  }, [
    fromAmount,
    fromToken,
    handleSubmit,
    setFromAmount,
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
            'shadow-[0px_4px_4px_0px_rgba(3,7,18,0.05)]',
          )}
        >
          Swap
        </label>
        {children}
      </div>
    </SwapContext.Provider>
  );
}
