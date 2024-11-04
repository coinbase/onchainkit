import { cn, text } from '../../styles/theme.js';
import { useGetCheckoutStatus } from '../hooks/useGetCheckoutStatus.js';
import { jsx } from 'react/jsx-runtime';
function CheckoutStatus({
  className
}) {
  const _useGetCheckoutStatus = useGetCheckoutStatus(),
    label = _useGetCheckoutStatus.label,
    labelClassName = _useGetCheckoutStatus.labelClassName;
  return /*#__PURE__*/jsx("div", {
    className: cn('flex justify-between', className),
    children: /*#__PURE__*/jsx("div", {
      className: text.label2,
      children: /*#__PURE__*/jsx("p", {
        className: labelClassName,
        children: label
      })
    })
  });
}
export { CheckoutStatus };
//# sourceMappingURL=CheckoutStatus.js.map
