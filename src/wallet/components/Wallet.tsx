import { useIsMounted } from '../../core-react/internal/hooks/useIsMounted';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { cn } from '../../styles/theme';
import { useOutsideClick } from '../../ui/react/internal/hooks/useOutsideClick';
import type { WalletReact } from '../types';
import { WalletProvider, useWalletContext } from './WalletProvider';

function WalletContent({ children, className }: WalletReact) {
  const componentTheme = useTheme();
  const { handleClose, containerRef: walletContainerRef } = useWalletContext();

  useOutsideClick(walletContainerRef, handleClose);

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
