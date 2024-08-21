import React from 'react';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';

export default {
  title: 'Wallet/WalletDropdownDisconnect',
  component: WalletDropdownDisconnect,
};

export const Default = () => <WalletDropdownDisconnect />;

export const CustomText = () => <WalletDropdownDisconnect text="Log Out" />;

export const CustomClass = () => (
  <WalletDropdownDisconnect className="custom-class" />
);