import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownBasename,
    WalletDropdownLink,
    WalletDropdownDisconnect,
  } from '@coinbase/onchainkit/wallet';
  import { Address, Avatar, Badge, EthBalance, Name, Identity } from '@coinbase/onchainkit/identity';
  import App from '../App.tsx';

  export const walletDemoCode = `
  import {
    ConnectWallet,
    Wallet,
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

  export defaultfunction WalletComponent() {
    return (
      <WalletDefault />
    )
  }
`

  function WalletDemo() {
    return (
<App>
  <Wallet>
  <ConnectWallet>
    <Avatar className="h-6 w-6" />
    <Name />
  </ConnectWallet>
  <WalletDropdown>
    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
      <Avatar />
      <Name>
        <Badge className="badge"/>
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
    )
  }

export default WalletDemo;