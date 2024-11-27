import { Avatar, Name } from '../../../identity';
import { ConnectWallet, ConnectWalletText, Wallet } from '../../../wallet';
import { WalletIsland } from './WalletIsland';
import AddressDetails from './WalletIslandAddressDetails';
import WalletIslandTokenHoldings from './WalletIslandTokenHoldings';
import WalletIslandTransactionActions from './WalletIslandTransactionActions';
import WalletIslandWalletActions from './WalletIslandWalletActions';

export function WalletIslandDefault() {
  return (
    <Wallet>
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
