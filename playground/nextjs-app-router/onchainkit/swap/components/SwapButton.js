import { Spinner } from '../../internal/components/Spinner.js';
import { cn, background, border, pressable, text, color } from '../../styles/theme.js';
import '../../wallet/index.js';
import { useSwapContext } from './SwapProvider.js';
import { jsx } from 'react/jsx-runtime';
import { ConnectWallet } from '../../wallet/components/ConnectWallet.js';
function SwapButton({
  className,
  disabled = false
}) {
  const _useSwapContext = useSwapContext(),
    address = _useSwapContext.address,
    to = _useSwapContext.to,
    from = _useSwapContext.from,
    statusName = _useSwapContext.lifecycleStatus.statusName,
    handleSubmit = _useSwapContext.handleSubmit;
  const isLoading = to.loading || from.loading || statusName === 'transactionPending' || statusName === 'transactionApproved';
  const isDisabled = !from.amount || !from.token || !to.amount || !to.token || disabled || isLoading;

  // disable swap if to and from token are the same
  const isSwapInvalid = to.token?.address === from.token?.address;

  // prompt user to connect wallet
  if (!isDisabled && !address) {
    return /*#__PURE__*/jsx(ConnectWallet, {
      className: "mt-4 w-full"
    });
  }
  return /*#__PURE__*/jsx("button", {
    type: "button",
    className: cn(background.primary, border.radius, 'w-full rounded-xl', 'mt-4 px-4 py-3', isDisabled && pressable.disabled, text.headline, className),
    onClick: () => handleSubmit(),
    disabled: isDisabled || isSwapInvalid,
    "data-testid": "ockSwapButton_Button",
    children: isLoading ? /*#__PURE__*/jsx(Spinner, {}) : /*#__PURE__*/jsx("span", {
      className: cn(text.headline, color.inverse),
      children: "Swap"
    })
  });
}
export { SwapButton };
//# sourceMappingURL=SwapButton.js.map
