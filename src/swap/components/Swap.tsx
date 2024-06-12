import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildSwapTransaction } from '../core/buildSwapTransaction';
import { getSwapQuote } from '../core/getSwapQuote';
import { SwapContext } from '../context';
import type { GetSwapQuoteResponse, SwapError, SwapReact } from '../types';
import type { Token } from '../../token';

function isSwapError(response: unknown): response is SwapError {
  return response !== null && typeof response === 'object' && 'error' in response;
}

export function Swap({ account, children }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();

  const handleSubmit = useCallback(async () => {
    console.log({ account, fromAmount, fromToken, toToken });
    if (account && fromToken && toToken && fromAmount) {
      // TODO: incomplete
      // const response = await buildSwapTransaction({
      //   amount: fromAmount,
      //   fromAddress: account.address,
      //   from: fromToken,
      //   to: toToken,
      // });
    }
  }, [account, fromAmount, fromToken, toToken]);

  const handleGetSwapQuote = useCallback(async () => {
    if (fromToken && toToken && fromAmount) {
      // TODO: incomplete
      // const response = await getSwapQuote({ from: fromToken, to: toToken, amount: fromAmount });
      // if (isSwapError(response)) {
      //   const a = response;
      // } else {
      //   const a = response;
      // }
    }
  }, [fromAmount, fromToken, toToken]);

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      handleGetSwapQuote();
    }
  }, [fromAmount, fromToken, toToken]);

  const value = useMemo(() => {
    return {
      account,
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
    account,
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
        <label className="box-border w-full border-b border-solid  p-4 text-base font-semibold leading-6 text-[#030712] shadow-[0px_4px_4px_0px_rgba(3,7,18,0.05)]">
          Swap
        </label>
        {children}
      </div>
    </SwapContext.Provider>
  );
}
