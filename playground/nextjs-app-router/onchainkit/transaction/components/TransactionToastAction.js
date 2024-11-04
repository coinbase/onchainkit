import { cn, text } from '../../styles/theme.js';
import { useGetTransactionToastAction } from '../hooks/useGetTransactionToastAction.js';
import { jsx } from 'react/jsx-runtime';
function TransactionToastAction({
  className
}) {
  const _useGetTransactionToa = useGetTransactionToastAction(),
    actionElement = _useGetTransactionToa.actionElement;
  return /*#__PURE__*/jsx("div", {
    className: cn(text.label1, 'text-nowrap', className),
    children: actionElement
  });
}
export { TransactionToastAction };
//# sourceMappingURL=TransactionToastAction.js.map
