import { cn, color } from '../../styles/theme';
import type { SwapSettingsSlippageTitleReact } from '../types';

export function SwapSettingsSlippageTitle({
  children,
  className,
}: SwapSettingsSlippageTitleReact) {
  return (
    <h3
      className={cn(
        color.foreground,
        'mb-2 font-semibold text-base leading-normal',
        className,
      )}
    >
      {children}
    </h3>
  );
}
