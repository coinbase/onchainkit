import { cn, color, text } from '../../styles/theme';
import { Avatar, Name } from '../../identity';
import { ConnectWallet, ConnectWalletText } from '../../wallet';
import { Wallet } from '../../wallet/components/Wallet';
import { WalletIsland } from './WalletIsland';
import WalletIslandWalletActions from './WalletIslandWalletActions';
import { useWalletContext } from '../../wallet/components/WalletProvider';
import { Address } from 'viem';

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

function AddressDetails() {
  const { address } = useWalletContext();
  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center gap-2',
        color.foreground,
        text.body,
      )}
    >
      <div className="w-10 h-10">
        <Avatar address={address} />
      </div>
      <div className="text-base">
        <Name address={address} />
      </div>
      <div className={cn('text-xl', text.title3)}>
        <AddressBalance address={address} />
      </div>
    </div>
  );
}

type AddressBalanceProps = {
  address?: Address | null;
};

function AddressBalance({ address }: AddressBalanceProps) {
  return <span>$690.42</span>;
}
