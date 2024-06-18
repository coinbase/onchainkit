import { useCallback, useEffect, useMemo } from 'react';

import { useSwapContext } from '../context';
import { TextLabel1, TextLabel2 } from '../../internal/text';
import { TokenChip, TokenSelectDropdown } from '../../token';
import { cn } from '../../utils/cn';
import { TextInput } from '../../internal/form/TextInput';
import { isValidAmount } from '../../utils/isValidAmount';
import type { SwapAmountInputReact } from '../types';
import type { Token } from '../../token';

export function SwapAmountInput({
  delayMs = 1000,
  label,
  token,
  type,
  swappableTokens,
}: SwapAmountInputReact) {
  const {
    convertedFromTokenBalance,
    convertedToTokenBalance,
    fromAmount,
    fromToken,
    handleFromAmountChange,
    handleToAmountChange,
    roundedFromTokenBalance,
    roundedToTokenBalance,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    swapQuoteLoadingState,
    toAmount,
    toToken,
  } = useSwapContext();

  const {
    amount,
    convertedBalance,
    handleAmountChange,
    isSwapQuoteLoading,
    roundedBalance,
    setAmount,
    setToken,
    selectedToken,
  } = useMemo(() => {
    if (type === 'to') {
      return {
        amount: toAmount,
        convertedBalance: convertedToTokenBalance,
        handleAmountChange: handleToAmountChange,
        isSwapQuoteLoading: swapQuoteLoadingState.isToQuoteLoading,
        roundedBalance: roundedToTokenBalance,
        selectedToken: toToken,
        setAmount: setToAmount,
        setToken: setToToken,
      };
    }
    return {
      amount: fromAmount,
      convertedBalance: convertedFromTokenBalance,
      handleAmountChange: handleFromAmountChange,
      isSwapQuoteLoading: swapQuoteLoadingState.isFromQuoteLoading,
      roundedBalance: roundedFromTokenBalance,
      selectedToken: fromToken,
      setAmount: setFromAmount,
      setToken: setFromToken,
    };
  }, [
    convertedFromTokenBalance,
    convertedToTokenBalance,
    fromAmount,
    fromToken,
    handleFromAmountChange,
    handleToAmountChange,
    roundedFromTokenBalance,
    roundedToTokenBalance,
    setFromAmount,
    setFromToken,
    setToAmount,
    setToToken,
    swapQuoteLoadingState,
    toAmount,
    toToken,
    type,
  ]);

  // we are mocking the token selectors so i'm not able
  // to test this since the components aren't actually rendering
  /* istanbul ignore next */
  const filteredTokens = useMemo(() => {
    if (type === 'to') {
      return swappableTokens?.filter(
        (t: Token) => t.symbol !== fromToken?.symbol,
      );
    }
    return swappableTokens?.filter((t: Token) => t.symbol !== toToken?.symbol);
  }, [fromToken, swappableTokens, toToken, type]);

  const handleMaxButtonClick = useCallback(() => {
    if (!convertedBalance) {
      return;
    }
    setAmount?.(convertedBalance);
    handleAmountChange?.(convertedBalance);
  }, [convertedBalance, setAmount, handleAmountChange]);

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);

  return (
    <div
      className={cn(
        'box-border flex w-full flex-col items-start',
        'rounded-md border-b border-solid bg-[#E5E7EB] p-4',
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <TextLabel2 className="text-gray-500">{label}</TextLabel2>
      </div>
      <div className="flex w-full items-center justify-between">
        <TextInput
          className="w-full border-[none] bg-transparent text-[2.5rem] text-display text-gray-900 text-sans leading-none outline-none"
          onChange={handleAmountChange}
          placeholder="0.0"
          value={amount}
          setValue={setAmount}
          delayMs={delayMs}
          inputValidator={isValidAmount}
          disabled={isSwapQuoteLoading}
        />
        {filteredTokens && (
          <TokenSelectDropdown
            options={filteredTokens}
            setToken={setToken}
            token={selectedToken}
          />
        )}
        {selectedToken && !filteredTokens && (
          <TokenChip token={selectedToken} />
        )}
      </div>
      <div className="mt-4 flex w-full justify-between">
        <TextLabel2>{''}</TextLabel2>
        <div className="flex items-center">
          {roundedBalance && (
            <TextLabel2 className="text-gray-500">{`Balance: ${roundedBalance}`}</TextLabel2>
          )}
          {type === 'from' && (
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center px-2 py-1"
              data-testid="ockSwapAmountInput_MaxButton"
              onClick={handleMaxButtonClick}
            >
              <TextLabel1 className="text-indigo-600">Max</TextLabel1>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
