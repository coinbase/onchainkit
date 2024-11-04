import { cn } from '../../styles/theme.js';
import { useIsMounted } from '../../useIsMounted.js';
import { useTheme } from '../../useTheme.js';
import { CheckoutProvider } from './CheckoutProvider.js';
import { jsx } from 'react/jsx-runtime';
function Checkout({
  chargeHandler,
  children,
  className,
  isSponsored,
  onStatus,
  productId
}) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();
  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  return /*#__PURE__*/jsx(CheckoutProvider, {
    chargeHandler: chargeHandler,
    isSponsored: isSponsored,
    onStatus: onStatus,
    productId: productId,
    children: /*#__PURE__*/jsx("div", {
      className: cn(componentTheme, 'flex w-full flex-col gap-2', className),
      children: children
    })
  });
}
export { Checkout };
//# sourceMappingURL=Checkout.js.map
