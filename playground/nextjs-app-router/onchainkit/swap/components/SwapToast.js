import { useCallback, useMemo, useEffect } from 'react';
import { closeSvg } from '../../internal/svg/closeSvg.js';
import { cn, background, text, color } from '../../styles/theme.js';
import { useAccount } from 'wagmi';
import { successSvg } from '../../internal/svg/successSvg.js';
import { getToastPosition } from '../../internal/utils/getToastPosition.js';
import { getChainExplorer } from '../../network/getChainExplorer.js';
import { useSwapContext } from './SwapProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
function SwapToast({
  className,
  durationMs = 3000,
  position = 'bottom-center'
}) {
  const _useSwapContext = useSwapContext(),
    isToastVisible = _useSwapContext.isToastVisible,
    setIsToastVisible = _useSwapContext.setIsToastVisible,
    setTransactionHash = _useSwapContext.setTransactionHash,
    transactionHash = _useSwapContext.transactionHash;
  const _useAccount = useAccount(),
    chainId = _useAccount.chainId;
  const chainExplorer = getChainExplorer(chainId);
  const closeToast = useCallback(() => {
    setIsToastVisible?.(false);
  }, [setIsToastVisible]);
  const positionClass = useMemo(() => {
    return getToastPosition(position);
  }, [position]);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isToastVisible) {
        setIsToastVisible?.(false);
        setTransactionHash?.('');
      }
    }, durationMs);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [durationMs, isToastVisible, setIsToastVisible, setTransactionHash]);
  if (!isToastVisible) {
    return null;
  }
  return /*#__PURE__*/jsxs("div", {
    className: cn(background.default, 'flex animate-enter items-center justify-between rounded-lg', 'p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]', '-translate-x-2/4 fixed z-20', positionClass, className),
    "data-testid": "ockSwapToast",
    children: [/*#__PURE__*/jsxs("div", {
      className: "flex items-center gap-4 p-2",
      children: [/*#__PURE__*/jsx("div", {
        className: cn(text.label2),
        children: successSvg
      }), /*#__PURE__*/jsx("div", {
        className: cn(text.label1, 'text-nowrap'),
        children: /*#__PURE__*/jsx("p", {
          className: color.foreground,
          children: "Successful"
        })
      }), /*#__PURE__*/jsx("div", {
        className: cn(text.label1, 'text-nowrap'),
        children: /*#__PURE__*/jsx("a", {
          href: `${chainExplorer}/tx/${transactionHash}`,
          target: "_blank",
          rel: "noreferrer",
          children: /*#__PURE__*/jsx("span", {
            className: cn(text.label1, color.primary),
            children: "View transaction"
          })
        })
      })]
    }), /*#__PURE__*/jsx("button", {
      className: "p-2",
      onClick: closeToast,
      type: "button",
      "data-testid": "ockCloseButton",
      children: closeSvg
    })]
  });
}
export { SwapToast };
//# sourceMappingURL=SwapToast.js.map
