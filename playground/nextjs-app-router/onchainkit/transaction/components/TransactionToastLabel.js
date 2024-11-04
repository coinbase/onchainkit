import { cn, text, color } from '../../styles/theme.js';
import { useGetTransactionToastLabel } from '../hooks/useGetTransactionToastLabel.js';
import { jsx } from 'react/jsx-runtime';
function TransactionToastLabel({
  className
}) {
  const _useGetTransactionToa = useGetTransactionToastLabel(),
    label = _useGetTransactionToa.label;
  return /*#__PURE__*/jsx("div", {
    className: cn(text.label1, 'text-nowrap', className),
    children: /*#__PURE__*/jsx("p", {
      className: color.foreground,
      children: label
    })
  });
}
export { TransactionToastLabel };
//# sourceMappingURL=TransactionToastLabel.js.map
