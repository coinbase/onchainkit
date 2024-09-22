import type { WalletDropdownFundLinkReact } from '../types';
import { useIsWalletACoinbaseSmartWallet } from '../hooks/useIsWalletACoinbaseSmartWallet';
import { WalletDropdownFundLinkButton } from './WalletDropdownFundLinkButton';
import { WalletDropdownFundLinkCoinbaseSmartWallet } from './WalletDropdownFundLinkCoinbaseSmartWallet';
import { WalletDropdownFundLinkEOAWallet } from './WalletDropdownFundLinkEOAWallet';

export function WalletDropdownFundLink({
  className,
  icon = 'fundWallet',
  openIn = 'popup',
  popupSize = 'md',
  rel,
  target,
  text = 'Fund wallet',
  fundingUrl,
}: WalletDropdownFundLinkReact) {
  const isCoinbaseSmartWallet = useIsWalletACoinbaseSmartWallet();

  if (fundingUrl) {
    return <WalletDropdownFundLinkButton {...{ className, icon, openIn, popupSize, rel, target, text, fundingUrl }} />;
  } else if (isCoinbaseSmartWallet) {
    return <WalletDropdownFundLinkCoinbaseSmartWallet {...{ className, icon, openIn, popupSize, rel, target, text }} />;
  } else {
    return <WalletDropdownFundLinkEOAWallet {...{ className, icon, openIn, popupSize, rel, target, text }} />;
  }
}
