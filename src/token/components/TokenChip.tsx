import { cn, pressable, text } from '../../styles/theme';
import type { TokenChipReact } from '../types';
import { TokenImage } from './TokenImage';

/**
 * Small button that display a given token symbol and image.
 *
 * WARNING: This component is under development and
 *          may change in the next few weeks.
 */
export function TokenChip({ token, onClick, className }: TokenChipReact) {
  return (
    <button
      type="button"
      data-testid="ockTokenChip_Button"
      className={cn(
        pressable.secondary,
        pressable.shadow,
        'flex w-fit shrink-0 items-center gap-2 rounded-lg py-1 pr-3 pl-1 ',
        className,
      )}
      onClick={() => onClick?.(token)}
    >
      <TokenImage token={token} size={24} />
      <span className={text.headline}>{token.symbol}</span>
    </button>
  );
}
