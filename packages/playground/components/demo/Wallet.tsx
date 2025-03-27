import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
  Socials,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownFundLink,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

function WalletComponent() {
  const { address } = useAccount();

  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet text="Connect Wallet">
          <Avatar address={address} className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2">
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
            <Socials />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownLink
            icon="wallet"
            href="https://keys.coinbase.com"
            target="_blank"
          >
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
