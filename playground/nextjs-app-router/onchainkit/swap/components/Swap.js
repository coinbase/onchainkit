import { useMemo, Children } from 'react';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn, background, border, color, text } from '../../styles/theme.js';
import { useIsMounted } from '../../useIsMounted.js';
import { useTheme } from '../../useTheme.js';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants.js';
import { SwapAmountInput } from './SwapAmountInput.js';
import { SwapButton } from './SwapButton.js';
import { SwapMessage } from './SwapMessage.js';
import { SwapProvider } from './SwapProvider.js';
import { SwapSettings } from './SwapSettings.js';
import { SwapToast } from './SwapToast.js';
import { SwapToggleButton } from './SwapToggleButton.js';
import { jsx, jsxs } from 'react/jsx-runtime';
function Swap({
  children,
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE
  },
  className,
  experimental = {
    useAggregator: false
  },
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  title = 'Swap'
}) {
  const componentTheme = useTheme();
  const _useMemo = useMemo(() => {
      const childrenArray = Children.toArray(children);
      return {
        inputs: childrenArray.filter(findComponent(SwapAmountInput)),
        toggleButton: childrenArray.find(findComponent(SwapToggleButton)),
        swapButton: childrenArray.find(findComponent(SwapButton)),
        swapMessage: childrenArray.find(findComponent(SwapMessage)),
        swapSettings: childrenArray.find(findComponent(SwapSettings)),
        swapToast: childrenArray.find(findComponent(SwapToast))
      };
    }, [children]),
    inputs = _useMemo.inputs,
    toggleButton = _useMemo.toggleButton,
    swapButton = _useMemo.swapButton,
    swapMessage = _useMemo.swapMessage,
    swapSettings = _useMemo.swapSettings,
    swapToast = _useMemo.swapToast;
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  return /*#__PURE__*/jsx(SwapProvider, {
    config: config,
    experimental: experimental,
    isSponsored: isSponsored,
    onError: onError,
    onStatus: onStatus,
    onSuccess: onSuccess,
    children: /*#__PURE__*/jsxs("div", {
      className: cn(componentTheme, background.default, border.radius, color.foreground, 'flex w-[500px] flex-col px-6 pt-6 pb-4', className),
      "data-testid": "ockSwap_Container",
      children: [/*#__PURE__*/jsxs("div", {
        className: "mb-4 flex items-center justify-between",
        children: [/*#__PURE__*/jsx("h3", {
          className: cn(text.title3),
          "data-testid": "ockSwap_Title",
          children: title
        }), swapSettings]
      }), inputs[0], /*#__PURE__*/jsx("div", {
        className: "relative h-1",
        children: toggleButton
      }), inputs[1], swapButton, swapToast, /*#__PURE__*/jsx("div", {
        className: "flex",
        children: swapMessage
      })]
    })
  });
}
export { Swap };
//# sourceMappingURL=Swap.js.map
