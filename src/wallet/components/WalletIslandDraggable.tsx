import { Avatar, Name } from '../../ui/react/identity';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { Wallet } from './Wallet';
import { WalletIsland } from './WalletIsland';
import { WalletIslandAddressDetails } from './WalletIslandAddressDetails';
import { WalletIslandTokenHoldings } from './WalletIslandTokenHoldings';
import { WalletIslandTransactionActions } from './WalletIslandTransactionActions';
import { WalletIslandWalletActions } from './WalletIslandWalletActions';

export function WalletIslandDraggable({
  startingPosition = {
    x: window.innerWidth - 300,
    y: window.innerHeight - 100,
  },
}: {
  startingPosition?: { x: number; y: number };
}) {
  return (
    <Wallet draggable={true} startingPosition={startingPosition}>
      <ConnectWallet>
        <ConnectWalletText>Connect Wallet</ConnectWalletText>
        <Avatar className="h-6 w-6" />
        <Name />
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
