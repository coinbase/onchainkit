'use client';
import { cn, color, text } from '../../styles/theme';
import type { SwapSettingsSlippageTitleReact } from '../types';

export function SwapSettingsSlippageTitle({
  children,
  className,
}: SwapSettingsSlippageTitleReact) {
  return (
    <h3
      className={cn(
        text.headline,
        color.foreground,
        'mb-2 text-base',
        className,
      )}
    >
      {children}
    </h3>
  );
}
