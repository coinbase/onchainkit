import { cn, color, text } from '../../styles/theme';
import type { SwapSettingsSlippageDescriptionReact } from '../types';

export function SwapSettingsSlippageDescription({
  children,
  className,
}: SwapSettingsSlippageDescriptionReact) {
  return (
    <p className={cn(text.legal, color.foregroundMuted, 'mb-2', className)}>
      {children}
    </p>
  );
}
