import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
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
import { useAccount, useSignMessage } from 'wagmi';
import { createSiweMessage } from 'viem/siwe';

import '@rainbow-me/rainbowkit/styles.css';

const message = createSiweMessage({
  address: '0xae9eCa1Fa2F786E16D35F5B8C5df3Ac484c490FF',
  chainId: 1,
  domain: 'example.com',
  nonce: 'foobarbaz',
  uri: 'https://example.com/path',
  version: '1',
});

function WalletComponent() {
  const { address } = useAccount();
  const { signMessage } = useSignMessage();

  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet
          text="Connect Wallet"
          onInitialConnect={() => {
            signMessage({ message });
          }}
        >
          <Avatar address={address} className="h-6 w-6" />
          <Name />
        </ConnectWallet>

        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
            <EthBalance />
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
