import { useCallback, useMemo, useEffect } from 'react';
import { closeSvg } from '../../internal/svg/closeSvg.js';
import { cn, background } from '../../styles/theme.js';
import { useTransactionContext } from './TransactionProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function TransactionToast({
  children,
  className,
  durationMs = 3000,
  position = 'bottom-center'
}) {
  const _useTransactionContex = useTransactionContext(),
    errorMessage = _useTransactionContex.errorMessage,
    isLoading = _useTransactionContex.isLoading,
    isToastVisible = _useTransactionContex.isToastVisible,
    receipt = _useTransactionContex.receipt,
    setIsToastVisible = _useTransactionContex.setIsToastVisible,
    transactionHash = _useTransactionContex.transactionHash,
    transactionId = _useTransactionContex.transactionId;
  const closeToast = useCallback(() => {
    setIsToastVisible(false);
  }, [setIsToastVisible]);
  const positionClass = useMemo(() => {
    if (position === 'bottom-right') {
      return 'bottom-5 left-3/4';
    }
    if (position === 'top-right') {
      return 'top-[100px] left-3/4';
    }
    if (position === 'top-center') {
      return 'top-[100px] left-2/4';
    }
    return 'bottom-5 left-2/4';
  }, [position]);
  useEffect(() => {
    let timer;
    // hide toast after 5 seconds once
    // it reaches final state (success or error)
    if (receipt || errorMessage) {
      timer = setTimeout(() => {
        setIsToastVisible(false);
      }, durationMs);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [errorMessage, durationMs, receipt, setIsToastVisible]);
  const isInProgress = !receipt && !isLoading && !transactionHash && !errorMessage && !transactionId;
  if (!isToastVisible || isInProgress) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn(background.default, 'flex animate-enter items-center justify-between rounded-lg', 'p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]', '-translate-x-2/4 fixed z-20', positionClass, className),
    children: [/*#__PURE__*/jsx("div", {
      className: "flex items-center gap-4 p-2",
      children: children
    }), /*#__PURE__*/jsx("button", {
      className: "p-2",
      onClick: closeToast,
      type: "button",
      "data-testid": "ockCloseButton",
      children: closeSvg
    })]
  });
}
export { TransactionToast };
//# sourceMappingURL=TransactionToast.js.map
