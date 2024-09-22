import { useMemo } from 'react';
import { getCoinbaseSmartWalletFundUrl } from '../../fund/utils/getCoinbaseSmartWalletFundUrl';
import type { WalletDropdownFundLinkReact } from '../types';
import { WalletDropdownFundLinkButton } from './WalletDropdownFundLinkButton';

export function WalletDropdownFundLinkCoinbaseSmartWallet({
  ...props
}: WalletDropdownFundLinkReact) {
  const fundingUrl = useMemo(() => {
    return getCoinbaseSmartWalletFundUrl();
  }, []);

  return <WalletDropdownFundLinkButton {...props} fundingUrl={fundingUrl} />;
}
