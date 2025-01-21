'use client';
import { toggleSvg } from '../../internal/svg/toggleSvg';
import { border, cn, pressable } from '../../styles/theme';
import type { SwapToggleButtonReact } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapToggleButton({ className }: SwapToggleButtonReact) {
  const { handleToggle } = useSwapContext();

  return (
    <button
      type="button"
      className={cn(
        pressable.alternate,
        border.default,
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
