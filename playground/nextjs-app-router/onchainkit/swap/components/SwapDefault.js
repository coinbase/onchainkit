import { Swap } from './Swap.js';
import { SwapAmountInput } from './SwapAmountInput.js';
import { SwapButton } from './SwapButton.js';
import { SwapMessage } from './SwapMessage.js';
import { SwapSettings } from './SwapSettings.js';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription.js';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput.js';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle.js';
import { SwapToast } from './SwapToast.js';
import { SwapToggleButton } from './SwapToggleButton.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function SwapDefault({
  config,
  className,
  disabled,
  experimental,
  from,
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  title = 'Swap',
  to
}) {
  return /*#__PURE__*/jsxs(Swap, {
    className: className,
    onStatus: onStatus,
    onSuccess: onSuccess,
    onError: onError,
    config: config,
    isSponsored: isSponsored,
    title: title,
    experimental: experimental,
    children: [/*#__PURE__*/jsxs(SwapSettings, {
      children: [/*#__PURE__*/jsx(SwapSettingsSlippageTitle, {
        children: "Max. slippage"
      }), /*#__PURE__*/jsx(SwapSettingsSlippageDescription, {
        children: "Your swap will revert if the prices change by more than the selected percentage."
      }), /*#__PURE__*/jsx(SwapSettingsSlippageInput, {})]
    }), /*#__PURE__*/jsx(SwapAmountInput, {
      label: "Sell",
      swappableTokens: from,
      token: from?.[0],
      type: "from"
    }), /*#__PURE__*/jsx(SwapToggleButton, {}), /*#__PURE__*/jsx(SwapAmountInput, {
      label: "Buy",
      swappableTokens: to,
      token: to?.[0],
      type: "to"
    }), /*#__PURE__*/jsx(SwapButton, {
      disabled: disabled
    }), /*#__PURE__*/jsx(SwapMessage, {}), /*#__PURE__*/jsx(SwapToast, {})]
  });
}
export { SwapDefault };
//# sourceMappingURL=SwapDefault.js.map
