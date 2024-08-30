import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageTitleReact } from '../types';

export function SwapSettingsSlippageTitle({
  children,
  className,
}: SwapSettingsSlippageTitleReact) {
  return (
    <h3
      className={cn(
        '--text-ock-foreground mb-2 font-semibold text-base leading-normal',
        className,
      )}
    >
      {children}
    </h3>
  );
}
