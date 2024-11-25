import {
  Address,
  Avatar,
  Badge,
  EthBalance,
  Identity,
  Name,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import App from '../App.tsx';

export const walletDemoCode = `
  import {
    ConnectWallet,
    Wallet,
    WalletDefault,
    WalletDropdown,
    WalletDropdownBasename,
    WalletDropdownLink,
    WalletDropdownDisconnect,
  } from '@coinbase/onchainkit/wallet';
  import {
    Address,
    Avatar,
    Badge,
    EthBalance,
    Name,
    Identity,
  } from '@coinbase/onchainkit/identity';

  function WalletDefaultDemo() {
    return <WalletDefault />
  }
  `;

function WalletDemo() {
  return (
    <App>
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2">
            <Avatar />
            <Name>
              <Badge className="badge" />
            </Name>
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownLink icon="wallet" href="https://keys.coinbase.com">
            Wallet
          </WalletDropdownLink>
          <WalletDropdownBasename />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </App>
  );
}

export default WalletDemo;
