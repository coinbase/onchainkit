import { memo } from 'react';
import type { TokenRowReact } from '../types';
import { formatAmount } from '../core/formatAmount';
import { TokenImage } from './TokenImage';
import { cn, pressable, text } from '../../styles/theme';

export const TokenRow = memo(function TokenRow({
  className,
  token,
  amount,
  onClick,
  hideImage,
  hideSymbol,
}: TokenRowReact) {
  return (
    <button
      data-testid="ockTokenRow_Container"
      type="button"
      className={cn(
        pressable.default,
        'flex h-16 w-full items-center justify-between px-2 py-1',
        className,
      )}
      onClick={() => onClick?.(token)}
    >
      <span className="flex items-center gap-3">
        {!hideImage && <TokenImage token={token} size={48} />}
        <span className="flex flex-col items-start">
          <span className={cn(text.headline)}>{token.name}</span>
          {!hideSymbol && (
            <span className={cn(text.body, 'text-foreground-muted')}>
              {token.symbol}
            </span>
          )}
        </span>
      </span>
      <span
        data-testid="ockTokenRow_Amount"
        className={cn(text.body, 'text-foreground-muted')}
      >
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </span>
    </button>
  );
});
