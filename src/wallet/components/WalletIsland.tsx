import type { WalletIslandProps } from '../types';
import { WalletIslandContent } from './WalletIslandContent';
import { WalletIslandProvider } from './WalletIslandProvider';

export function WalletIsland({ children }: WalletIslandProps) {
  return (
    <WalletIslandProvider>
      <WalletIslandContent>{children}</WalletIslandContent>
    </WalletIslandProvider>
  );
}
