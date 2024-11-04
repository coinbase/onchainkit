import { cn, text } from '../../styles/theme.js';
import { useGetTransactionStatusAction } from '../hooks/useGetTransactionStatusAction.js';
import { jsx } from 'react/jsx-runtime';
function TransactionStatusAction({
  className
}) {
  const _useGetTransactionSta = useGetTransactionStatusAction(),
    actionElement = _useGetTransactionSta.actionElement;
  return /*#__PURE__*/jsx("div", {
    className: cn(text.label2, 'min-w-[70px]', className),
    children: actionElement
  });
}
export { TransactionStatusAction };
//# sourceMappingURL=TransactionStatusAction.js.map
