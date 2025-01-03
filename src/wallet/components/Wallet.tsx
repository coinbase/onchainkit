import { useIsMounted } from '@/core-react/internal/hooks/useIsMounted';
import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { findComponent } from '@/core-react/internal/utils/findComponent';
import { cn } from '@/styles/theme';
import { useOutsideClick } from '@/ui-react/internal/hooks/useOutsideClick';
import { Children, cloneElement, useMemo, useRef } from 'react';
import type { WalletReact } from '../types';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletIsland } from './WalletIsland';
import { WalletProvider, useWalletContext } from './WalletProvider';

function WalletContent({ children, className }: WalletReact) {
  const { isOpen, handleClose } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(walletContainerRef, handleClose);

  const { connect, dropdown, island } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connect: childrenArray.find(findComponent(ConnectWallet)),
      dropdown: childrenArray.find(findComponent(WalletDropdown)),
      island: (() => {
        const islandComponent = childrenArray.find(findComponent(WalletIsland));
        return islandComponent
          ? cloneElement(islandComponent, { walletContainerRef })
          : null;
      })(),
    };
  }, [children]);

  const walletSubComponent = dropdown || island;
  if (dropdown && island) {
    console.error(
      'Defaulted to WalletDropdown. Wallet cannot have both WalletDropdown and WalletIsland as children.',
    );
  }

  return (
    <div
      ref={walletContainerRef}
      className={cn('relative w-fit shrink-0', className)}
    >
      {connect}
      {isOpen && walletSubComponent}
    </div>
  );
}

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
