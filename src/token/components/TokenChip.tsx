import { useMemo } from 'react';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { background, cn, pressable, text } from '../../styles/theme';
import type { TokenChipReact } from '../types';
import { TokenImage } from './TokenImage';

/**
 * Small button that display a given token symbol and image.
 *
 */
export function TokenChip({
  token,
  onClick,
  className,
  isPressable = true,
}: TokenChipReact) {
  const componentTheme = useTheme();

  const commonStyles = cn(
    componentTheme,
    background.secondary,
    'flex w-fit shrink-0 items-center gap-2 rounded-lg py-1 pr-3 pl-1',
  );

  const tokenContent = useMemo(() => {
    return (
      <>
        <TokenImage token={token} size={24} />
        <span className={text.headline}>{token.symbol}</span>
      </>
    );
  }, [token]);

  if (!isPressable) {
    return (
      <div
        data-testid="ockTokenChip_Button"
        className={cn(commonStyles, 'cursor-default', className)}
      >
        {tokenContent}
      </div>
    );
  }

  return (
    <button
      type="button"
      data-testid="ockTokenChip_Button"
      className={cn(commonStyles, pressable.shadow, className)}
      onClick={() => onClick?.(token)}
    >
      {tokenContent}
    </button>
  );
}
