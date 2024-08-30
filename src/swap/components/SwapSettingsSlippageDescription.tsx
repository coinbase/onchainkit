import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageDescriptionReact } from '../types';

export function SwapSettingsSlippageDescription({
  children,
  className,
}: SwapSettingsSlippageDescriptionReact) {
  return (
    <p
      className={cn(
        'mb-2 font-normal font-sans text-ock-foreground-muted text-xs leading-4',
        className,
      )}
    >
      {children}
    </p>
  );
}
