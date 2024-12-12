import type { WalletIslandProps } from '../../types';
import { useWalletContext } from '../WalletProvider';
import { WalletIslandContent } from './WalletIslandContent';
import { WalletIslandProvider } from './WalletIslandProvider';

export function WalletIsland({ children }: WalletIslandProps) {
  const { isOpen } = useWalletContext();

  if (!isOpen) {
    return null;
  }

  return (
    <WalletIslandProvider>
      <WalletIslandContent>{children}</WalletIslandContent>
    </WalletIslandProvider>
  );
}
