import { useCallback, useEffect, useMemo } from 'react';

import { useSwapContext } from '../context';
import { TokenChip, TokenSelectDropdown } from '../../token';
import { background, cn, color, pressable, text } from '../../styles/theme';
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
    swapLoadingState,
    toAmount,
    toToken,
  } = useSwapContext();

  const {
    amount,
    convertedBalance,
    handleAmountChange,
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
        isSwapQuoteLoading: swapLoadingState.isToQuoteLoading,
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
      isSwapQuoteLoading: swapLoadingState.isFromQuoteLoading,
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
    swapLoadingState,
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

  const hasInsufficientBalance =
    type === 'from' && Number(convertedBalance) < Number(amount);

  return (
    <div
      className={cn(
        background.alternate,
        'box-border flex w-full flex-col items-start',
        'rounded-md border-b border-solid p-4',
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <span className={cn(text.label2, 'text-foreground-muted')}>
          {label}
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <TextInput
          className={cn(
            'w-full border-[none] bg-transparent font-display text-[2.5rem]',
            'leading-none outline-none',
            hasInsufficientBalance ? color.error : color.foreground,
          )}
          onChange={handleAmountChange}
          placeholder="0.0"
          value={amount}
          setValue={setAmount}
          delayMs={delayMs}
          inputValidator={isValidAmount}
        />
        {filteredTokens && (
          <TokenSelectDropdown
            options={filteredTokens}
            setToken={setToken}
            token={selectedToken}
          />
        )}
        {selectedToken && !filteredTokens && (
          <TokenChip className={pressable.inverse} token={selectedToken} />
        )}
      </div>
      <div className="mt-4 flex w-full justify-between">
        <span className={cn(text.label2, 'text-foregroune-muted')}>{''}</span>
        <div className="flex items-center">
          {roundedBalance && (
            <span
              className={cn(text.label2, 'text-foreground-muted')}
            >{`Balance: ${roundedBalance}`}</span>
          )}
          {type === 'from' && (
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center px-2 py-1"
              data-testid="ockSwapAmountInput_MaxButton"
              onClick={handleMaxButtonClick}
            >
              <span className={cn(text.label1, 'text-primary')}>Max</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
