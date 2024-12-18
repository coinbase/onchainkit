import { useIsMounted } from '@/core-react/internal/hooks/useIsMounted';
import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { findComponent } from '@/core-react/internal/utils/findComponent';
import { cn } from '@/styles/theme';
import { useOutsideClick } from '@/ui-react/internal/hooks/useOutsideClick';
import { Children, useMemo } from 'react';
import type { WalletReact } from '../types';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider, useWalletContext } from './WalletProvider';

function WalletContent({ children, className }: WalletReact) {
  const componentTheme = useTheme();
  const {
    isOpen,
    handleClose,
    containerRef: walletContainerRef,
  } = useWalletContext();

  const { connect, dropdown } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connect: childrenArray.find(findComponent(ConnectWallet)),
      dropdown: childrenArray.find(findComponent(WalletDropdown)),
    };
  }, [children]);

  useOutsideClick(walletContainerRef, handleClose);

  return (
    <div
      ref={walletContainerRef}
      className={cn('relative w-fit shrink-0', componentTheme, className)}
    >
      {connect}
      {isOpen && dropdown}
    </div>
  );
}

export const Wallet = ({ children }: WalletReact) => {
  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <WalletProvider>
      <WalletContent>{children}</WalletContent>
    </WalletProvider>
  );
};
