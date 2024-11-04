import { useMemo, Children, isValidElement, cloneElement, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Identity } from '../../identity/components/Identity.js';
import { cn, background } from '../../styles/theme.js';
import { useWalletContext } from './WalletProvider.js';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
function WalletBottomSheet({
  children,
  className
}) {
  const _useWalletContext = useWalletContext(),
    isOpen = _useWalletContext.isOpen,
    setIsOpen = _useWalletContext.setIsOpen;
  const _useAccount = useAccount(),
    address = _useAccount.address;
  const childrenArray = useMemo(() => {
    return Children.toArray(children).map(child => {
      if ( /*#__PURE__*/isValidElement(child) && child.type === Identity) {
        // @ts-ignore
        return /*#__PURE__*/cloneElement(child, {
          address
        });
      }
      return child;
    });
  }, [children, address]);
  const handleOverlayClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  const handleEscKeyPress = useCallback(event => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, [setIsOpen]);
  if (!address) {
    return null;
  }
  return /*#__PURE__*/jsxs(Fragment, {
    children: [isOpen && /*#__PURE__*/jsx("div", {
      className: "fixed inset-0 z-40 bg-black bg-opacity-20",
      onClick: handleOverlayClick,
      onKeyDown: handleEscKeyPress,
      role: "button",
      tabIndex: 0
    }), /*#__PURE__*/jsx("div", {
      className: cn(background.default, 'fixed right-0 bottom-0 left-0 z-50', 'transform rounded-[20px_20px_0_0] p-4 transition-transform', `${isOpen ? 'translate-y-0' : 'translate-y-full'}`, className),
      "data-testid": "ockWalletBottomSheet",
      children: childrenArray
    })]
  });
}
export { WalletBottomSheet };
//# sourceMappingURL=WalletBottomSheet.js.map
