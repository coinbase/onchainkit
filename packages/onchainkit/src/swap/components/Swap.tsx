'use client';
import { useIsMounted } from '../../internal/hooks/useIsMounted';
import { useTheme } from '../../internal/hooks/useTheme';
import { background, border, cn, color, text } from '../../styles/theme';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import type { SwapReact } from '../types';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapMessage } from './SwapMessage';
import { SwapProvider } from './SwapProvider';
import { SwapSettings } from './SwapSettings';
import { SwapToast } from './SwapToast';
import { SwapToggleButton } from './SwapToggleButton';

function SwapDefaultContent({
  to,
  from,
  disabled,
}: Pick<SwapReact, 'to' | 'from' | 'disabled'>) {
  return (
    <>
      <SwapSettings />
      <SwapAmountInput
        label="Sell"
        swappableTokens={from}
        token={from?.[0]}
        type="from"
      />
      <SwapToggleButton />
      <SwapAmountInput
        label="Buy"
        swappableTokens={to}
        token={to?.[0]}
        type="to"
      />
      <SwapButton disabled={disabled} />
      <SwapMessage />
      <SwapToast />
    </>
  );
}

export function Swap({
  children,
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
  className,
  disabled,
  to,
  from,
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
          'relative flex w-full max-w-[500px] flex-col px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockSwap_Container"
      >
        <div className="absolute flex w-1/2 items-center justify-between">
          {headerLeftContent}
          <h3
            className={cn(text.title3, 'text-center')}
            data-testid="ockSwap_Title"
          >
            {title}
          </h3>
        </div>
        {children ?? (
          <SwapDefaultContent to={to} from={from} disabled={disabled} />
        )}
      </div>
    </SwapProvider>
  );
}
