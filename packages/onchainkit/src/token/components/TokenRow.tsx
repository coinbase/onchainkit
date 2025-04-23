'use client';

import { memo } from 'react';
import { useTheme } from '../../internal/hooks/useTheme';
import { cn, color, pressable, text } from '../../styles/theme';
import type { TokenRowReact } from '../types';
import { formatAmount } from '../utils/formatAmount';
import { TokenImage } from './TokenImage';

export const TokenRow = memo(function TokenRow({
  className,
  token,
  amount,
  onClick,
  hideImage,
  hideSymbol,
}: TokenRowReact) {
  const componentTheme = useTheme();

  return (
    <button
      data-testid="ockTokenRow_Container"
      type="button"
      className={cn(
        componentTheme,
        pressable.default,
        'flex w-full items-center justify-between px-2 py-1',
        className,
      )}
      onClick={() => onClick?.(token)}
    >
      <span className="flex max-w-full items-center gap-3">
        {!hideImage && <TokenImage token={token} size={28} />}
        <span className="flex min-w-0 flex-col items-start">
          <span
            className={cn(
              text.headline,
              'max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left',
            )}
          >
            {token.name.trim()}
          </span>
          {!hideSymbol && (
            <span className={cn(text.body, color.foregroundMuted)}>
              {token.symbol}
            </span>
          )}
        </span>
      </span>
      <span
        data-testid="ockTokenRow_Amount"
        className={cn(text.body, color.foregroundMuted)}
      >
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </span>
    </button>
  );
});
