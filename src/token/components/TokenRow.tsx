import { memo } from 'react';
import { cn, color, pressable, text } from '../../styles/theme';
import { useTheme } from '../../useTheme';
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
      <span className="flex items-center gap-3">
        {!hideImage && <TokenImage token={token} size={28} />}
        <span className="flex flex-col items-start">
          <span className={cn(text.headline)}>{token.name}</span>
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
