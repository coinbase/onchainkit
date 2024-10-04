import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageDescriptionReact } from '../types';

export function SwapSettingsSlippageDescription({
  children,
  className,
}: SwapSettingsSlippageDescriptionReact) {
  return (
    <p
      className={cn(
        'ock-text-foreground-muted mb-2 font-normal font-sans text-xs leading-4',
        className,
      )}
    >
      {children}
    </p>
  );
}
