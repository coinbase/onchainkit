import { useCallback, useEffect, useMemo } from 'react';
import { TokenChip, TokenSelectDropdown } from '../../token';
import { background, cn, color, pressable, text } from '../../styles/theme';
import { TextInput } from '../../internal/form/TextInput';
import { isValidAmount } from '../../utils/isValidAmount';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { useSwapContext } from './SwapProvider';
import type { SwapAmountInputReact } from '../types';
import type { Token } from '../../token';

function useValue<T>(object: T): T {
  return useMemo(() => object, [object]);
}

export function SwapAmountInput({
  className,
  delayMs = 1000,
  label,
  token,
  type,
  swappableTokens,
}: SwapAmountInputReact) {
  const { to, from, handleAmountChange } = useSwapContext();

  const source = useValue(type === 'from' ? from : to);
  const destination = useValue(type === 'from' ? to : from);

  useEffect(() => {
    if (token) {
      source.setToken(token);
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
      source.setToken(token);
      handleAmountChange(type, source.amount, token);
    },
    [source.amount, source.setToken, handleAmountChange, type],
  );

  // we are mocking the token selectors so i'm not able
  // to test this since the components aren't actually rendering
  /* istanbul ignore next */
  const sourceTokenOptions = useMemo(() => {
    return (
      swappableTokens?.filter(
        ({ symbol }: Token) => symbol !== destination.token?.symbol,
      ) ?? []
    );
  }, [swappableTokens, destination.token]);

  const hasInsufficientBalance =
    type === 'from' && Number(source.balance) < Number(source.amount);

  console.log('omg', source.token);

  return (
    <div
      className={cn(
        background.alternate,
        'box-border flex w-full flex-col items-start',
        'rounded-md border-b border-solid p-4',
        className,
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
          placeholder="0.0"
          delayMs={delayMs}
          value={source.amount}
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
        <span className={cn(text.label2, 'text-foregroune-muted')}>{''}</span>
        <div className="flex items-center">
          {source.balance && (
            <span
              className={cn(text.label2, 'text-foreground-muted')}
            >{`Balance: ${getRoundedAmount(source.balance, 8)}`}</span>
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
