import { Children, useMemo, useRef } from 'react';
import { findComponent } from '../../core-react/internal/utils/findComponent';
import { cn } from '../../styles/theme';
import { useIsMounted } from '../../core-react/internal/hooks/useIsMounted';
import { useOutsideClick } from '../../internal/hooks/useOutsideClick';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import type { WalletReact } from '../types';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider, useWalletContext } from './WalletProvider';

const WalletContent = ({ children, className }: WalletReact) => {
  const { isOpen, setIsOpen } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(walletContainerRef, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  const { connect, dropdown } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connect: childrenArray.find(findComponent(ConnectWallet)),
      dropdown: childrenArray.find(findComponent(WalletDropdown)),
    };
  }, [children]);

  return (
    <div
      ref={walletContainerRef}
      className={cn('relative w-fit shrink-0', className)}
    >
      {connect}
      {isOpen && dropdown}
    </div>
  );
};

export const Wallet = ({ children, className }: WalletReact) => {
  const componentTheme = useTheme();
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <WalletProvider>
      <WalletContent className={cn(componentTheme, className)}>
        {children}
      </WalletContent>
    </WalletProvider>
  );
};
