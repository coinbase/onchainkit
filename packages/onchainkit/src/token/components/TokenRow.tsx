'use client';

import { memo } from 'react';
import { cn, pressable, text } from '../../styles/theme';
import type { TokenRowProps } from '../types';
import { formatAmount } from '../utils/formatAmount';
import { TokenImage } from './TokenImage';

export const TokenRow = memo(function TokenRow({
  className,
  token,
  amount,
  onClick,
  hideImage,
  hideSymbol,
  as,
}: TokenRowProps) {
  const Component = as ?? 'button';

  return (
    <Component
      data-testid="ockTokenRow_Container"
      type="button"
      className={cn(
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
            <span className={cn(text.body, 'text-ock-text-foreground-muted')}>
              {token.symbol}
            </span>
          )}
        </span>
      </span>
      <span
        data-testid="ockTokenRow_Amount"
        className={cn(text.body, 'text-ock-text-foreground-muted')}
      >
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </span>
    </Component>
  );
});
