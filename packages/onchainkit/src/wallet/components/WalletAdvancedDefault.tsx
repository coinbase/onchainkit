'use client';

import { ConnectWallet } from './ConnectWallet';
import { Wallet } from './Wallet';
import { WalletAdvanced } from './WalletAdvanced';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { WalletAdvancedTokenHoldings } from './WalletAdvancedTokenHoldings';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';

export function WalletAdvancedDefault() {
  return (
    <Wallet>
      <ConnectWallet />
      <WalletAdvanced>
        <WalletAdvancedWalletActions />
        <WalletAdvancedAddressDetails />
        <WalletAdvancedTransactionActions />
        <WalletAdvancedTokenHoldings />
      </WalletAdvanced>
    </Wallet>
  );
}
