import { Children, useCallback, useMemo, useState } from 'react';
import type { SwapError, SwapReact } from '../types';
import type { Token } from '../../token';
import { SwapContext } from '../context';
import { formatTokenAmount } from '../../utils/formatTokenAmount';
import { getSwapQuote } from '../core/getSwapQuote';
import { isSwapError } from '../core/isSwapError';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapToggleButton } from './SwapToggleButton';
import { SwapButton } from './SwapButton';
import { TextTitle3 } from '../../internal/text';

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

  const handleToggle = useCallback(() => {
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setToToken(fromToken);
    setFromToken(toToken);
  }, [fromAmount, fromToken, toAmount, toToken]);

  const value = useMemo(() => {
    return {
      address,
      fromAmount,
      fromToken,
      handleFromAmountChange,
      handleToAmountChange,
      handleToggle,
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
    handleToggle,
    toAmount,
    toToken,
  ]);

  const { inputs, toggleButton, swapButton } = useMemo(() => {
    const childrenArray = Children.toArray(children);

    return {
      // @ts-ignore
      inputs: childrenArray.filter(({ type }) => type === SwapAmountInput),
      // @ts-ignore
      toggleButton: childrenArray.find(({ type }) => type === SwapToggleButton),
      // @ts-ignore
      swapButton: childrenArray.find(({ type }) => type === SwapButton),
    };
  }, [children]);

  return (
    <SwapContext.Provider value={value}>
      <div className="flex w-[500px] flex-col rounded-xl bg-gray-100 px-6 pt-6 pb-4">
        <div className="mb-4">
          <TextTitle3>Swap</TextTitle3>
        </div>
        {inputs[0]}
        <div className="relative h-1">{toggleButton}</div>
        {inputs[1]}
        {swapButton}
      </div>
    </SwapContext.Provider>
  );
}
