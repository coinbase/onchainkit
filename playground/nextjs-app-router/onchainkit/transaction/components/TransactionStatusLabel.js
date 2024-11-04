import { cn, text } from '../../styles/theme.js';
import { useGetTransactionStatusLabel } from '../hooks/useGetTransactionStatusLabel.js';
import { jsx } from 'react/jsx-runtime';
function TransactionStatusLabel({
  className
}) {
  const _useGetTransactionSta = useGetTransactionStatusLabel(),
    label = _useGetTransactionSta.label,
    labelClassName = _useGetTransactionSta.labelClassName;
  return /*#__PURE__*/jsx("div", {
    className: cn(text.label2, className),
    children: /*#__PURE__*/jsx("p", {
      className: labelClassName,
      children: label
    })
  });
}
export { TransactionStatusLabel };
//# sourceMappingURL=TransactionStatusLabel.js.map
