'use client';

import { Avatar, Name } from '@/identity';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { Wallet } from './Wallet';
import { WalletAdvanced } from './WalletAdvanced';

export function WalletAdvancedDefault() {
  return (
    <Wallet>
      <ConnectWallet>
        <ConnectWalletText>Connect Wallet</ConnectWalletText>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletAdvanced />
    </Wallet>
  );
}
