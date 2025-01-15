'use client';
import { useIsMounted } from '../../core-react/internal/hooks/useIsMounted';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { background, border, cn, color, text } from '../../styles/theme';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import type { SwapReact } from '../types';
import { SwapProvider } from './SwapProvider';

export function Swap({
  children,
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
  className,
  experimental = { useAggregator: false },
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  title = 'Swap',
  headerLeftContent,
}: SwapReact) {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  return (
    <SwapProvider
      config={config}
      experimental={experimental}
      isSponsored={isSponsored}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <div
        className={cn(
          componentTheme,
          background.default,
          border.radius,
          color.foreground,
          'flex w-[500px] flex-col px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockSwap_Container"
      >
        <div>
          {headerLeftContent}
            <h3 className={cn(text.title3)} data-testid="ockSwap_Title">
              {title}
            </h3>
        </div>
        {children}
      </div>
    </SwapProvider>
  );
}
