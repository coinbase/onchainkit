import type { SwapError, SwapReact } from '../types';
import type { Token } from '../../token';
import { SwapContext } from '../context';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import { getSwapQuote } from '../core/getSwapQuote';
import { isSwapError } from '../core/isSwapError';
import { useCallback, useMemo, useState } from 'react';

export function Swap({ address, children, onError }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();

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
        const formattedAmount = formatTokenAmount(
          response?.toAmount,
          response?.to?.decimals,
        );
        setToAmount(formattedAmount);
      } catch (error) {
        onError?.(error as SwapError);
      }
    },
    [fromToken, toToken, setFromAmount, setToAmount],
  );

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
        const formattedAmount = formatTokenAmount(
          response.fromAmount,
          response?.from?.decimals,
        );
        setFromAmount(formattedAmount);
      } catch (error) {
        onError?.(error as SwapError);
      }
    },
    [fromToken, toToken, setFromAmount, setToAmount],
  );

  const value = useMemo(() => {
    return {
      address,
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
    address,
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
      <div className="flex w-[400px] flex-col rounded-xl bg-gray-100 pt-6 pb-4 px-6">
        <label className="text-base font-semibold text-[#030712] leading-6 mb-4">
          Swap
        </label>
        {children}
      </div>
    </SwapContext.Provider>
  );
}
