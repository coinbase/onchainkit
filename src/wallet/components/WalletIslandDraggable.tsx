import { Avatar, Name } from '../../ui/react/identity';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { Wallet } from './Wallet';
import { WalletIsland } from './WalletIsland';
import { AddressDetails } from './WalletIslandAddressDetails';
import { WalletIslandTokenHoldings } from './WalletIslandTokenHoldings';
import { WalletIslandTransactionActions } from './WalletIslandTransactionActions';
import { WalletIslandWalletActions } from './WalletIslandWalletActions';

export function WalletIslandDraggable() {
  return (
    <Wallet draggable={true}>
      <ConnectWallet>
        <ConnectWalletText>Connect Wallet</ConnectWalletText>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletIsland>
        <WalletIslandWalletActions />
        <AddressDetails />
        <WalletIslandTransactionActions />
        <WalletIslandTokenHoldings />
      </WalletIsland>
    </Wallet>
  );
}
