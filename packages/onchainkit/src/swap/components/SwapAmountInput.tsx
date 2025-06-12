'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { SwapEvent } from '@/core/analytics/types';
import { TextInput } from '@/internal/components/TextInput';
import { useValue } from '@/internal/hooks/useValue';
import { getRoundedAmount } from '@/internal/utils/getRoundedAmount';
import { isValidAmount } from '@/internal/utils/isValidAmount';
import { cn, pressable, text } from '@/styles/theme';
import type { Token } from '@/token';
import { TokenChip, TokenSelectDropdown } from '@/token';
import type { SwapAmountInputProps } from '../types';
import {
  formatMaybeScientificNotationToDecimal,
  formatUSD,
} from '@/utils/formatter';
import { useSwapContext } from './SwapProvider';

export function SwapAmountInput({
  className,
  delayMs = 1000,
  label,
  token,
  type,
  swappableTokens,
  render,
}: SwapAmountInputProps) {
  const { address, to, from, handleAmountChange } = useSwapContext();
  const { sendAnalytics } = useAnalytics();

  const source = useValue(type === 'from' ? from : to);
  const destination = useValue(type === 'from' ? to : from);
  const { setToken, setAmount, balance, amount, amountUSD } = source;

  useEffect(() => {
    if (token) {
      setToken?.(token);
    }
  }, [token, setToken]);

  const handleMaxButtonClick = useCallback(() => {
    if (!balance) {
      return;
    }
    setAmount(balance);
    handleAmountChange(type, balance);
  }, [balance, setAmount, handleAmountChange, type]);

  const handleChange = useCallback(
    (amount: string) => {
      handleAmountChange(type, amount);
    },
    [handleAmountChange, type],
  );

  const handleAnalyticsTokenSelected = useCallback(
    (token: Token) => {
      sendAnalytics(SwapEvent.TokenSelected, {
        token: token.symbol,
      });
    },
    [sendAnalytics],
  );

  const handleSetToken = useCallback(
    (token: Token) => {
      setToken?.(token);
      handleAmountChange(type, amount, token);
      handleAnalyticsTokenSelected(token);
    },
    [amount, setToken, handleAmountChange, handleAnalyticsTokenSelected, type],
  );

  // We are mocking the token selectors so I'm not able
  // to test this since the components aren't actually rendering
  const sourceTokenOptions = useMemo(() => {
    return (
      swappableTokens?.filter(
        ({ symbol }: Token) => symbol !== destination.token?.symbol,
      ) ?? []
    );
  }, [swappableTokens, destination.token]);

  const hasInsufficientBalance =
    type === 'from' && Number(balance) < Number(amount);

  if (render) {
    return render({
      token: source,
      hasInsufficientBalance,
      setAmountToMax: handleMaxButtonClick,
      onSetToken: handleSetToken,
    });
  }

  return (
    <div
      className={cn(
        'bg-ock-bg-secondary rounded-ock-default my-0.5 box-border flex h-[148px] w-full flex-col items-start p-4',
        className,
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div
        className={cn(
          text.label2,
          'text-ock-text-foreground-muted flex w-full items-center justify-between',
        )}
      >
        {label}
      </div>
      <div className="flex w-full items-center justify-between">
        <TextInput
          className={cn(
            'mr-2 w-full border-[none] bg-transparent font-display text-[2.5rem] leading-none outline-none truncate',
          )}
          aria-label={type === 'from' ? 'From amount' : 'To amount'}
          error={!!(hasInsufficientBalance && address)}
          placeholder="0.0"
          delayMs={delayMs}
          value={formatMaybeScientificNotationToDecimal(amount)}
          setValue={setAmount}
          disabled={source.loading}
          onChange={handleChange}
          inputValidator={isValidAmount}
        />
        {sourceTokenOptions.length > 0 ? (
          <TokenSelectDropdown
            token={source.token}
            setToken={handleSetToken}
            options={sourceTokenOptions}
          />
        ) : (
          source.token && (
            <TokenChip className={pressable.inverse} token={source.token} />
          )
        )}
      </div>
      <div className="mt-4 flex w-full items-center justify-between">
        <div className={cn(text.label2, 'text-ock-text-foreground-muted')}>
          {formatUSD(amountUSD)}
        </div>
        <div
          className={cn(
            text.label2,
            'text-ock-text-foreground-muted flex grow items-center justify-end',
          )}
        >
          {balance && <span>{`Balance: ${getRoundedAmount(balance, 8)}`}</span>}
          {type === 'from' && address && (
            <button
              type="button"
              className={cn(
                text.label1,
                'text-ock-text-primary flex cursor-pointer items-center justify-center px-2 py-1',
              )}
              data-testid="ockSwapAmountInput_MaxButton"
              onClick={handleMaxButtonClick}
            >
              Max
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
