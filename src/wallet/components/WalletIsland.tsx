import type { WalletIslandReact } from '../types';
import { WalletIslandContent } from './WalletIslandContent';
import { WalletIslandProvider } from './WalletIslandProvider';

export function WalletIsland({ children }: WalletIslandReact) {
  return (
    <WalletIslandProvider>
      <WalletIslandContent>{children}</WalletIslandContent>
    </WalletIslandProvider>
  );
}
