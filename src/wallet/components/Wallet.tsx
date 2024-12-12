import { useEffect } from 'react';
import { useIsMounted } from '../../core-react/internal/hooks/useIsMounted';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { cn } from '../../styles/theme';
import type { WalletReact } from '../types';
import { WalletProvider, useWalletContext } from './WalletProvider';

function WalletContent({ children, className }: WalletReact) {
  const componentTheme = useTheme();
  const {
    isOpen,
    handleClose,
    containerRef: walletContainerRef,
  } = useWalletContext();

  useEffect(() => {
    const handleClickOutsideComponent = (event: MouseEvent) => {
      if (
        walletContainerRef?.current &&
        !walletContainerRef?.current.contains(event.target as Node) &&
        isOpen
      ) {
        handleClose();
      }
    };

    document.addEventListener('click', handleClickOutsideComponent);
    return () =>
      document.removeEventListener('click', handleClickOutsideComponent);
  }, [isOpen, handleClose, walletContainerRef]);

  return (
    <div
      ref={walletContainerRef}
      className={cn('relative w-fit shrink-0', componentTheme, className)}
    >
      {children}
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
