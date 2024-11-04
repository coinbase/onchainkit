import { useRef, useMemo, Children, useEffect } from 'react';
import { findComponent } from '../../internal/utils/findComponent.js';
import { cn } from '../../styles/theme.js';
import { useIsMounted } from '../../useIsMounted.js';
import { useTheme } from '../../useTheme.js';
import { ConnectWallet } from './ConnectWallet.js';
import { WalletDropdown } from './WalletDropdown.js';
import { useWalletContext, WalletProvider } from './WalletProvider.js';
import { jsxs, jsx } from 'react/jsx-runtime';
const WalletContent = ({
  children,
  className
}) => {
  const _useWalletContext = useWalletContext(),
    isOpen = _useWalletContext.isOpen,
    setIsOpen = _useWalletContext.setIsOpen;
  const walletContainerRef = useRef(null);
  const _useMemo = useMemo(() => {
      const childrenArray = Children.toArray(children);
      return {
        connect: childrenArray.find(findComponent(ConnectWallet)),
        dropdown: childrenArray.find(findComponent(WalletDropdown))
      };
    }, [children]),
    connect = _useMemo.connect,
    dropdown = _useMemo.dropdown;

  // Handle clicking outside the wallet component to close the dropdown.
  useEffect(() => {
    const handleClickOutsideComponent = event => {
      if (walletContainerRef.current && !walletContainerRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutsideComponent);
    return () => document.removeEventListener('click', handleClickOutsideComponent);
  }, [isOpen, setIsOpen]);
  return /*#__PURE__*/jsxs("div", {
    ref: walletContainerRef,
    className: cn('relative w-fit shrink-0', className),
    children: [connect, isOpen && dropdown]
  });
};
const Wallet = ({
  children,
  className
}) => {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }
  return /*#__PURE__*/jsx(WalletProvider, {
    children: /*#__PURE__*/jsx(WalletContent, {
      className: cn(componentTheme, className),
      children: children
    })
  });
};
export { Wallet };
//# sourceMappingURL=Wallet.js.map
