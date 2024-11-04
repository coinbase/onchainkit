import { cn, text, color } from '../../styles/theme.js';
import { useTransactionContext } from './TransactionProvider.js';
import { jsx } from 'react/jsx-runtime';
function TransactionSponsor({
  className
}) {
  const _useTransactionContex = useTransactionContext(),
    errorMessage = _useTransactionContex.errorMessage,
    lifecycleStatus = _useTransactionContex.lifecycleStatus,
    paymasterUrl = _useTransactionContex.paymasterUrl,
    receipt = _useTransactionContex.receipt,
    transactionHash = _useTransactionContex.transactionHash,
    transactionId = _useTransactionContex.transactionId;
  const transactionInProgress = transactionId || transactionHash;
  if (lifecycleStatus.statusName !== 'init' || !paymasterUrl || errorMessage || transactionInProgress || receipt) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn(text.label2, 'flex', className),
    children: /*#__PURE__*/jsx("p", {
      className: color.foregroundMuted,
      children: "Zero transaction fee"
    })
  });
}
export { TransactionSponsor };
//# sourceMappingURL=TransactionSponsor.js.map
