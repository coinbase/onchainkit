'use client';

import { Avatar, Name } from '@/identity';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { Wallet } from './Wallet';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { WalletAdvancedTokenHoldings } from './WalletAdvancedTokenHoldings';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';
import { WalletDropdown } from './WalletDropdown';

export function WalletAdvancedDefault() {
  return (
    <Wallet>
      <ConnectWallet>
        <ConnectWalletText>Connect Wallet</ConnectWalletText>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown>
        <WalletAdvancedWalletActions />
        <WalletAdvancedAddressDetails />
        <WalletAdvancedTransactionActions />
        <WalletAdvancedTokenHoldings />
      </WalletDropdown>
    </Wallet>
  );
}
