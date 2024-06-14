import { useCallback, useMemo, useState } from 'react';
import type { SwapError, SwapReact } from '../types';
import type { Token } from '../../token';
import { SwapContext } from '../context';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import { getSwapQuote } from '../core/getSwapQuote';
import { isSwapError } from '../core/isSwapError';

export function Swap({ address, children, onError }: SwapReact) {
  const [fromAmount, setFromAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token>();
  const [toAmount, setToAmount] = useState('');
  const [toToken, setToToken] = useState<Token>();

  const handleFromAmountChange = useCallback(
    async (amount: string) => {
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
    [fromToken, onError, toToken],
  );

  const handleToAmountChange = useCallback(
    async (amount: string) => {
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
    [fromToken, onError, toToken],
  );

  const value = useMemo(() => {
    return {
      address,
      fromAmount,
      fromToken,
      handleFromAmountChange,
      handleToAmountChange,
      setFromAmount,
      setFromToken,
      setToToken,
      setToAmount,
      toAmount,
      toToken,
    };
  }, [
    address,
    fromAmount,
    fromToken,
    handleFromAmountChange,
    handleToAmountChange,
    toAmount,
    toToken,
  ]);

  return (
    <SwapContext.Provider value={value}>
      <div className="flex w-[400px] flex-col rounded-xl bg-gray-100 px-6 pt-6 pb-4">
        <label className="mb-4 font-semibold text-[#030712] text-base leading-6">
          Swap
        </label>
        {children}
      </div>
    </SwapContext.Provider>
  );
}
