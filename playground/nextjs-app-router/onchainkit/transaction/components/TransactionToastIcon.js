import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner.js';
import { errorSvg } from '../../internal/svg/errorSvg.js';
import { successSvg } from '../../internal/svg/successSvg.js';
import { cn, text } from '../../styles/theme.js';
import { useTransactionContext } from './TransactionProvider.js';
import { jsx } from 'react/jsx-runtime';
function TransactionToastIcon({
  className
}) {
  const _useTransactionContex = useTransactionContext(),
    errorMessage = _useTransactionContex.errorMessage,
    isLoading = _useTransactionContex.isLoading,
    receipt = _useTransactionContex.receipt,
    transactionHash = _useTransactionContex.transactionHash,
    transactionId = _useTransactionContex.transactionId;
  const isInProgress = isLoading || !!transactionId || !!transactionHash;
  const icon = useMemo(() => {
    // txn successful
    if (receipt) {
      return successSvg;
    }
    if (errorMessage) {
      return errorSvg;
    }
    if (isInProgress) {
      return /*#__PURE__*/jsx(Spinner, {
        className: "px-1.5 py-1.5"
      });
    }
    return null;
  }, [isInProgress, errorMessage, receipt]);
  if (!icon) {
    return null;
  }
  return /*#__PURE__*/jsx("div", {
    className: cn(text.label2, className),
    children: icon
  });
}
export { TransactionToastIcon };
//# sourceMappingURL=TransactionToastIcon.js.map
