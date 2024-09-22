import { useMemo } from 'react';
import type { WalletDropdownFundLinkReact } from '../types';
import { useOnchainKit } from '../../useOnchainKit';
import { useAccount } from 'wagmi';
import { getOnrampBuyUrl } from '../../fund/utils/getOnrampBuyUrl';
import { WalletDropdownFundLinkButton } from './WalletDropdownFundLinkButton';

export function WalletDropdownFundLinkEOAWallet({
  ...props
}: WalletDropdownFundLinkReact) {
  const { projectId, chain: defaultChain } = useOnchainKit();
  const { address, chain: accountChain } = useAccount();

  // If the connected wallet's active chain is not included in the Wagmi config, accountChain will be undefined. If this
  // is the case, fall back to the default chain specified in the OnchainKit config.
  const chain = accountChain || defaultChain;

  if (projectId === null || address === undefined) {
    return null;
  }

  const fundingUrl = useMemo(() => {
      return getOnrampBuyUrl({
        projectId,
        addresses: { [address]: [chain.name.toLowerCase()] },
      })
  }, [projectId, address, chain]);

  return (
    // The Coinbase Onramp widget is not very responsive, so we need to override the popup size.
    <WalletDropdownFundLinkButton 
      {...props}
      popupHeightOverride={720}
      popupWidthOverride={460}
      fundingUrl={fundingUrl}
    />
  );
}