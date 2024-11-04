import { cn } from '../../styles/theme.js';
import { jsx } from 'react/jsx-runtime';
function TransactionStatus({
  children,
  className
}) {
  return /*#__PURE__*/jsx("div", {
    className: cn('flex justify-between', className),
    children: children
  });
}
export { TransactionStatus };
//# sourceMappingURL=TransactionStatus.js.map
