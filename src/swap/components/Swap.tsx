import { Children, cloneElement, useMemo } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import { background, cn, text } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import type { SwapReact } from '../types';
import { SwapAmountInput } from './SwapAmountInput';
import { SwapButton } from './SwapButton';
import { SwapMessage } from './SwapMessage';
import { SwapProvider } from './SwapProvider';
import { SwapSettings } from './SwapSettings';
import { SwapToast } from './SwapToast';
import { SwapToggleButton } from './SwapToggleButton';

const DEFAULT_CHILDREN = [
  <SwapSettings key="settings" />,
  <SwapAmountInput key="from"
    label="Sell"
    type="from"
  />,
  <SwapToggleButton key="toggle" />,
  <SwapAmountInput
    key="to"
    label="Buy"
    type="to"
  />,
  <SwapButton key="button" />,
  <SwapMessage key="message" />,
  <SwapToast key="toast" />,
];

export function Swap({
  children = DEFAULT_CHILDREN,
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
  to,
  from,
  swappableTokens,
}: SwapReact) {
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
      to={to}
      from={from}
      swappableTokens={swappableTokens}
    >
      <div
        className={cn(
          background.default,
          'flex w-[500px] flex-col rounded-xl px-6 pt-6 pb-4',
          className,
        )}
        data-testid="ockSwap_Container"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3
            className={cn(text.title3, 'text-inherit')}
            data-testid="ockSwap_Title"
          >
            {title}
          </h3>
          {swapSettings}
        </div>
        {cloneElement(inputs[0], { token: from, swappableTokens })}
        {/* {inputs[0]} */}
        <div className="relative h-1">{toggleButton}</div>
        {cloneElement(inputs[1], { token: to, swappableTokens })}
        {/* {inputs[1]} */}
        {swapButton}
        {swapToast}
        <div className="flex">{swapMessage}</div>
      </div>
    </SwapProvider>
  );
}
