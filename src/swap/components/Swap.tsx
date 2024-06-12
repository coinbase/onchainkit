import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSwapQuote } from '../core/getSwapQuote';
import { cn } from '../../lib/utils';
import { isSwapError } from '../utils';
import { SwapContext } from '../context';
import type { SwapError, SwapReact } from '../types';
import type { Token } from '../../token';

export function Swap({ account, children, onError }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();
  const [swapQuoteError, setSwapQuoteError] = useState('');
  const [swapTransactionError, setSwapTransactionError] = useState('');
  const [lastTokenAmountUpdated, setLastTokenAmountUpdated] = useState<'to' | 'from' | undefined>();

  const handleGetSwapQuote = useCallback(
    /* the reference amount for the swap */
    async (amountReference: 'to' | 'from') => {
      setSwapQuoteError('');
      setSwapTransactionError('');
      if (fromToken && toToken && (fromAmount || toAmount) && amountReference) {
        try {
          const amount = amountReference === 'from' ? fromAmount : toAmount;
          const response = await getSwapQuote({
            from: fromToken,
            to: toToken,
            amount,
            amountReference,
          });
          if (isSwapError(response)) {
            setSwapQuoteError(response.error);
          } else {
            if (amountReference === 'from') {
              setToAmount(response?.toAmount);
            }
            if (amountReference === 'to') {
              setFromAmount(response?.fromAmount);
            }
            setLastTokenAmountUpdated(undefined);
          }
        } catch (error) {
          onError?.(error as SwapError);
        }
      }
    },
    [fromAmount, fromToken, toAmount, toToken],
  );

  useEffect(() => {
    /* we only want to fetch the swap quote for fromToken
    reference amount if the user last changed the fromAmount  */
    if (fromToken && toToken && fromAmount && lastTokenAmountUpdated === 'from') {
      handleGetSwapQuote('from');
    }
  }, [fromAmount, fromToken, handleGetSwapQuote, lastTokenAmountUpdated, toToken]);

  useEffect(() => {
    /* we only want to fetch the swap quote for toToken
    reference amount if the user last changed the toAmount  */
    if (fromToken && toToken && toAmount && lastTokenAmountUpdated === 'to') {
      handleGetSwapQuote('to');
    }
  }, [fromToken, handleGetSwapQuote, lastTokenAmountUpdated, toAmount, toToken]);

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
