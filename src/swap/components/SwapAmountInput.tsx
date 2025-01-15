'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { useValue } from '../../core-react/internal/hooks/useValue';
import { getRoundedAmount } from '../../core/utils/getRoundedAmount';
import { isValidAmount } from '../../core/utils/isValidAmount';
import { TextInput } from '../../internal/components/TextInput';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
import { TokenChip, TokenSelectDropdown } from '../../token';
import type { Token } from '../../token';
import type { SwapAmountInputReact } from '../types';
import { formatAmount } from '../utils/formatAmount';
import { useSwapContext } from './SwapProvider';

export function SwapAmountInput({
  classNames,
  delayMs = 1000,
  label,
  token,
  type,
  swappableTokens,
}: SwapAmountInputReact) {
  const { address, to, from, handleAmountChange, classNames: swapClassNames } = useSwapContext();

  const componentStyles = {
    input: swapClassNames?.input ?? classNames?.input,
    token: swapClassNames?.token ?? classNames?.token,
    balance: swapClassNames?.balance ?? classNames?.balance,
  };

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

  const handleSetToken = useCallback(
    (token: Token) => {
      source.setToken?.(token);
      handleAmountChange(type, source.amount, token);
    },
    [source.amount, source.setToken, handleAmountChange, type],
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
        'my-0.5 box-border flex h-[148px] w-full flex-col items-start p-4',
        componentStyles.input,
      )}
      data-testid="ockSwapAmountInput_Container"
    >
      <div className={cn(text.label2, color.foregroundMuted, 'flex w-full items-center justify-between')}>
        {label}
      </div>
      <div className={cn('flex w-full items-center justify-between', componentStyles.token)}>
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
      <div className={cn('mt-4 flex w-full items-center justify-between', componentStyles.balance)}>
          <span className={cn(text.label2, color.foregroundMuted, 'grow')}>
            {formatUSD(source.amountUSD)}
          </span>
          {source.balance && (
            <span
              className={cn(text.label2, color.foregroundMuted)}
            >Balance: {getRoundedAmount(source.balance, 8)}</span>
          )}
          {type === 'from' && address && (
            <button
              type="button"
              className={cn(text.label1, color.primary, 'flex cursor-pointer items-center justify-center px-2 py-1')}
              data-testid="ockSwapAmountInput_MaxButton"
              onClick={handleMaxButtonClick}
            >
              Max
            </button>
          )}
      </div>
    </div>
  );
}
