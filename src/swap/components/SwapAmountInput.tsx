'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { SwapEvent } from '../../core/analytics/types';
import { TextInput } from '../../internal/components/TextInput';
import { useValue } from '../../internal/hooks/useValue';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { isValidAmount } from '../../internal/utils/isValidAmount';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
import type { Token } from '../../token';
import { TokenChip, TokenSelectDropdown } from '../../token';
import type { SwapAmountInputReact } from '../types';
import { formatAmount } from '../utils/formatAmount';
import { useSwapContext } from './SwapProvider';

export function SwapAmountInput({
  className,
  delayMs = 1000,
  label,
  token,
  type,
  swappableTokens,
}: SwapAmountInputReact) {
  const { address, to, from, handleAmountChange } = useSwapContext();
  const { sendAnalytics } = useAnalytics();

  const source = useValue(type === 'from' ? from : to);
  const destination = useValue(type === 'from' ? to : from);
  useEffect(() => {
    if (token) {
      source.setToken?.(token);
    }
  }, [token, source.setToken]);

  const handleMaxButtonClick = useCallback(() => {
    if (!source.balance) {
      return;
    }
    source.setAmount(source.balance);
    handleAmountChange(type, source.balance);
  }, [source.balance, source.setAmount, handleAmountChange, type]);

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
      source.setToken?.(token);
      handleAmountChange(type, source.amount, token);
      handleAnalyticsTokenSelected(token);
    },
    [
      source.amount,
      source.setToken,
      handleAmountChange,
      type,
      handleAnalyticsTokenSelected,
    ],
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
    type === 'from' && Number(source.balance) < Number(source.amount);

  const formatUSD = (amount: string) => {
    if (!amount || amount === '0') {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(amount, 2));
    return `~$${roundedAmount.toFixed(2)}`;
  };

  return (
    <div
      className={cn(
        background.secondary,
        border.radius,
        'box-border flex h-[148px] w-full flex-col items-start p-4',
        className,
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className="flex w-full items-center justify-between">
        <span className={cn(text.label2, color.foregroundMuted)}>{label}</span>
      </div>
      <div className="flex w-full items-center justify-between">
        <TextInput
          className={cn(
            'mr-2 w-full border-[none] bg-transparent font-display text-[2.5rem]',
            'leading-none outline-none',
            hasInsufficientBalance && address ? color.error : color.foreground,
          )}
          placeholder="0.0"
          delayMs={delayMs}
          value={formatAmount(source.amount)}
          setValue={source.setAmount}
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
      <div className="mt-4 flex w-full justify-between">
        <div className="flex items-center">
          <span className={cn(text.label2, color.foregroundMuted)}>
            {formatUSD(source.amountUSD)}
          </span>
        </div>
        <span className={cn(text.label2, color.foregroundMuted)}>{''}</span>
        <div className="flex items-center">
          {source.balance && (
            <span
              className={cn(text.label2, color.foregroundMuted)}
            >{`Balance: ${getRoundedAmount(source.balance, 8)}`}</span>
          )}
          {type === 'from' && address && (
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center px-2 py-1"
              data-testid="ockSwapAmountInput_MaxButton"
              onClick={handleMaxButtonClick}
            >
              <span className={cn(text.label1, color.primary)}>Max</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
