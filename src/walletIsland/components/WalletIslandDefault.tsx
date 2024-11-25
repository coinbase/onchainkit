import { Avatar, Name } from '../../identity';
import { ConnectWallet, ConnectWalletText } from '../../wallet';
import { Wallet } from '../../wallet/components/Wallet';
import { WalletIsland } from './WalletIsland';
import WalletIslandWalletActions from './WalletIslandWalletActions';
import AddressDetails from './WalletIslandAddressDetails';

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
      </WalletIsland>
    </Wallet>
  );
}
