import type { WalletIslandProps } from '../types';
import { WalletIslandProvider } from './WalletIslandProvider';
import { WalletIslandContent } from './WalletIslandContent';

export function WalletIsland({
  children,
  walletContainerRef,
}: WalletIslandProps) {
  return (
    <WalletIslandProvider>
      <WalletIslandContent walletContainerRef={walletContainerRef}>
        {children}
      </WalletIslandContent>
    </WalletIslandProvider>
  );
}
