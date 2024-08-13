import { Children, useEffect, useMemo, useRef } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import type { WalletReact } from '../types';
import { ConnectWallet } from './ConnectWallet';
import { WalletMenu } from './WalletMenu';
import { WalletProvider, useWalletContext } from './WalletProvider';

const WalletContent = ({ children }: WalletReact) => {
  const { isOpen, setIsOpen } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  const { menu, connect } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connect: childrenArray.find(findComponent(ConnectWallet)),
      menu: childrenArray.find(findComponent(WalletMenu)),
    };
  }, [children]);

  // Handle clicking outside the wallet component to close the dropdown.
  useEffect(() => {
    const handleClickOutsideComponent = (event: MouseEvent) => {
      if (
        walletContainerRef.current &&
        !walletContainerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutsideComponent);
    return () =>
      document.removeEventListener('click', handleClickOutsideComponent);
  }, [isOpen, setIsOpen]);

  return (
    <div ref={walletContainerRef} className="relative w-fit shrink-0">
      {connect}
      {isOpen && menu}
    </div>
  );
};

export const Wallet = ({ children }: WalletReact) => {
  return (
    <WalletProvider>
      <WalletContent>{children}</WalletContent>
    </WalletProvider>
  );
};
