'use client';
import { cn, text } from '@/styles/theme';
import type { SwapSettingsSlippageTitleProps } from '../types';

export function SwapSettingsSlippageTitle({
  children,
  className,
}: SwapSettingsSlippageTitleProps) {
  return (
    <h3
      className={cn(
        text.headline,
        'text-ock-text-foreground',
        'mb-2 text-base',
        className,
      )}
    >
      {children}
    </h3>
  );
}
