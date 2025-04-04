import {
  Address,
  Avatar,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { Step } from '../Step';

export function Connect() {
  return (
    <Step
      number={1}
      label="Connect your wallet"
      description="Set up a wallet using your Warpcast recovery key.  This is available in the Warpcast mobile app under Settings > Advanced > Farcaster recovery phrase."
    >
      <Wallet>
        <ConnectWallet className="w-full">
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </Step>
  );
}
