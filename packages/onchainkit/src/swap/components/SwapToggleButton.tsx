'use client';
import { toggleSvg } from '@/internal/svg/toggleSvg';
import { cn, pressable } from '@/styles/theme';
import type { SwapToggleButtonProps } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapToggleButton({ className, render }: SwapToggleButtonProps) {
  const { handleToggle } = useSwapContext();

  if (render) {
    return render({ onToggle: handleToggle });
  }

  return (
    <button
      type="button"
      className={cn(
        pressable.alternate,
        'border-ock-background',
        '-my-6 relative mx-auto',
        'flex h-12 w-12 items-center justify-center',
        'rounded-lg border-4 border-solid',
        className,
      )}
      data-testid="SwapTokensButton"
      onClick={handleToggle}
    >
      {toggleSvg}
    </button>
  );
}
