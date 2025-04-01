import { background, border, cn } from '../../styles/theme';
import type { SwapSettingsSlippageLayoutReact } from '../types';

export function SwapSettingsSlippageLayout({
  children,
  className,
}: SwapSettingsSlippageLayoutReact) {
  return (
    <div
      className={cn(
        background.default,
        border.radius,
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
