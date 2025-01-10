import { portfolioSvg } from '@/internal/svg/portfolioSvg';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { Wallet } from './Wallet';
import { WalletIsland } from './WalletIsland';
import { WalletIslandAddressDetails } from './WalletIslandAddressDetails';
import { WalletIslandTokenHoldings } from './WalletIslandTokenHoldings';
import { WalletIslandTransactionActions } from './WalletIslandTransactionActions';
import { WalletIslandWalletActions } from './WalletIslandWalletActions';
import { useAccount } from 'wagmi';
import { Avatar } from '@/ui/react/identity';

export function WalletIslandDraggable({
  startingPosition = {
    x: window.innerWidth - 125,
    y: window.innerHeight - 125,
  },
}: {
  startingPosition?: { x: number; y: number };
}) {
  const { status } = useAccount();

  return (
    <Wallet draggable={true} draggableStartingPosition={startingPosition}>
      <ConnectWallet className='!rounded-full m-0 flex h-14 w-14 min-w-14 flex-col items-center justify-center p-0'>
        <ConnectWalletText>
          <div className="h-5 w-5">{portfolioSvg}</div>
        </ConnectWalletText>
        {status === 'connected' ? (
          <Avatar className='pointer-events-none h-14 w-14' />
        ) : (
          <div className="h-5 w-5">{portfolioSvg}</div>
        )}
      </ConnectWallet>
      <WalletIsland>
        <WalletIslandWalletActions />
        <WalletIslandAddressDetails />
        <WalletIslandTransactionActions />
        <WalletIslandTokenHoldings />
      </WalletIsland>
    </Wallet>
  );
}
