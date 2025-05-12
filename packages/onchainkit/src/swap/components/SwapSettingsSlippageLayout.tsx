import { border, cn } from '@/styles/theme';
import type { SwapSettingsSlippageLayoutProps } from '../types';

export function SwapSettingsSlippageLayout({
  children,
  className,
}: SwapSettingsSlippageLayoutProps) {
  return (
    <div
      className={cn(
        'bg-ock-bg-default',
        'rounded-ock-default',
        border.lineDefault,
        'right-0 z-10 w-[21.75rem] px-3 py-3',
        className,
      )}
      data-testid="ockSwapSettingsLayout_container"
    >
      {children}
    </div>
  );
}
