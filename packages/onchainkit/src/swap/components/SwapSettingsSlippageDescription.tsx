import { cn, text } from '@/styles/theme';
import type { SwapSettingsSlippageDescriptionProps } from '../types';

export function SwapSettingsSlippageDescription({
  children,
  className,
}: SwapSettingsSlippageDescriptionProps) {
  return (
    <p
      className={cn(
        text.legal,
        'text-ock-text-foreground-muted',
        'mb-2',
        className,
      )}
    >
      {children}
    </p>
  );
}
