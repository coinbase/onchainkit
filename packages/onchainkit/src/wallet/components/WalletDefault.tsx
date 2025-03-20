'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '../../identity';
import { color } from '../../styles/theme';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { Wallet } from './Wallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownLink } from './WalletDropdownLink';

export function WalletDefault() {
  return (
    <Wallet>
      <ConnectWallet>
        <ConnectWalletText>Connect Wallet</ConnectWalletText>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2">
          <Avatar />
          <Name />
          <Address className={color.foregroundMuted} />
          <EthBalance />
        </Identity>
        <WalletDropdownLink
          icon="wallet"
          href="https://keys.coinbase.com"
          target="_blank"
        >
          Wallet
        </WalletDropdownLink>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}
