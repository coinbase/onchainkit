import { useEffect, useRef } from 'react';
import { cn } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useTheme } from '../../useTheme';
import type { WalletReact } from '../types';
import { WalletProvider, useWalletContext } from './WalletProvider';

function WalletContent({ children, className }: WalletReact) {
  const componentTheme = useTheme();
  const { isOpen, setIsOpen } = useWalletContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

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
