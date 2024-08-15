import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBaseName,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { color } from '@coinbase/onchainkit/theme';

function WalletComponent() {
  const { address } = useAccount();

  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet>
          <Avatar address={address!} className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
          </Identity>
          <WalletDropdownBaseName />
          <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
            Wallet
          </WalletDropdownLink>
          <WalletDropdownFundLink />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}

export default function WalletDemo() {
  return (
    <div className="mx-auto">
      <WalletComponent />
    </div>
  );
}
