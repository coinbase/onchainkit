import { Children, useMemo } from 'react';
import { useIsMounted } from '../../core-react/internal/hooks/useIsMounted';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { findComponent } from '../../core-react/internal/utils/findComponent';
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
}: SwapReact) {
  const componentTheme = useTheme();

  const {
    inputs,
    toggleButton,
    swapButton,
    swapMessage,
    swapSettings,
    swapToast,
  } = useMemo(() => {
    const childrenArray = Children.toArray(children);

    return {
      inputs: childrenArray.filter(findComponent(SwapAmountInput)),
      toggleButton: childrenArray.find(findComponent(SwapToggleButton)),
      swapButton: childrenArray.find(findComponent(SwapButton)),
      swapMessage: childrenArray.find(findComponent(SwapMessage)),
      swapSettings: childrenArray.find(findComponent(SwapSettings)),
      swapToast: childrenArray.find(findComponent(SwapToast)),
    };
  }, [children]);

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
        <div className="relative mb-4 flex items-center">
          <h3 className={cn(text.title3, 'w-full')} data-testid="ockSwap_Title">
            {title}
          </h3>
          <div className="absolute right-0">{swapSettings}</div>
        </div>
        {inputs[0]}
        <div className="relative h-1">{toggleButton}</div>
        {inputs[1]}
        {swapButton}
        {swapToast}
        <div className="flex">{swapMessage}</div>
      </div>
    </SwapProvider>
  );
}
