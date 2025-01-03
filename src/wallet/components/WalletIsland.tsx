import type { WalletIslandProps } from '../types';
import { WalletIslandContent } from './WalletIslandContent';
import { WalletIslandProvider } from './WalletIslandProvider';

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
