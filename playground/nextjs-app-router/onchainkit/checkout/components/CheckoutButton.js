import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner.js';
import { useIcon } from '../../internal/hooks/useIcon.js';
import { cn, pressable, border, text, color } from '../../styles/theme.js';
import { CHECKOUT_LIFECYCLESTATUS } from '../constants.js';
import { useCheckoutContext } from './CheckoutProvider.js';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
function CheckoutButton({
  className,
  coinbaseBranded,
  disabled,
  icon,
  text: text$1 = 'Pay'
}) {
  if (coinbaseBranded) {
    icon = 'coinbasePay';
    text$1 = 'Pay with Crypto';
  }
  const _useCheckoutContext = useCheckoutContext(),
    lifecycleStatus = _useCheckoutContext.lifecycleStatus,
    onSubmit = _useCheckoutContext.onSubmit;
  const iconSvg = useIcon({
    icon
  });
  const isLoading = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.PENDING;
  const isFetchingData = lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.FETCHING_DATA;
  const isDisabled = disabled || isLoading || isFetchingData;
  const buttonText = useMemo(() => {
    if (lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.SUCCESS) {
      return 'View payment details';
    }
    if (lifecycleStatus?.statusName === CHECKOUT_LIFECYCLESTATUS.ERROR && lifecycleStatus?.statusData.error === 'User has insufficient balance') {
      return 'Get USDC';
    }
    return text$1;
  }, [lifecycleStatus?.statusName, lifecycleStatus?.statusData, text$1]);
  const shouldRenderIcon = buttonText === text$1 && iconSvg;
  return /*#__PURE__*/jsx("button", {
    className: cn(coinbaseBranded ? pressable.coinbaseBranding : pressable.primary, border.radius, isDisabled && pressable.disabled, text.headline, 'mt-4 w-full px-4 py-3', className),
    onClick: onSubmit,
    type: "button",
    disabled: isDisabled,
    children: /*#__PURE__*/jsx("div", {
      className: "flex items-center justify-center whitespace-nowrap",
      children: isLoading ? /*#__PURE__*/jsx(Spinner, {
        className: "h-5 w-5"
      }) : /*#__PURE__*/jsxs(Fragment, {
        children: [shouldRenderIcon && /*#__PURE__*/jsx("div", {
          className: "mr-2 flex h-5 w-5 shrink-0 items-center justify-center",
          children: iconSvg
        }), /*#__PURE__*/jsx("span", {
          className: cn(text.headline, coinbaseBranded ? 'text-gray-50' : color.inverse),
          children: buttonText
        })]
      })
    })
  });
}
export { CheckoutButton };
//# sourceMappingURL=CheckoutButton.js.map
