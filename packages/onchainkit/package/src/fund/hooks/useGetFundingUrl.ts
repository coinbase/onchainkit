import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useOnchainKit } from '../../useOnchainKit';
import { useIsWalletACoinbaseSmartWallet } from '../../wallet/hooks/useIsWalletACoinbaseSmartWallet';
import { getCoinbaseSmartWalletFundUrl } from '../utils/getCoinbaseSmartWalletFundUrl';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl';

/**
 * Gets the correct funding URL based on the connected wallet. If a Coinbase Smart Wallet is connected it will send the
 * user to keys.coinbase.com, otherwise it will send them to pay.coinbase.com.
 * @returns the funding URL and optional popup dimensions if the URL requires them
 */
export function useGetFundingUrl({
  fiatCurrency,
  originComponentName,
}: {
  fiatCurrency?: string;
  originComponentName?: string;
}): string | undefined {
  const { projectId, chain: defaultChain } = useOnchainKit();
  const { address, chain: accountChain } = useAccount();
  const isCoinbaseSmartWallet = useIsWalletACoinbaseSmartWallet();

  // If the connected wallet's active chain is not included in the Wagmi config, accountChain will be undefined. If this
  // is the case, fall back to the default chain specified in the OnchainKit config.
  const chain = accountChain || defaultChain;

  return useMemo(() => {
    if (isCoinbaseSmartWallet) {
      return getCoinbaseSmartWalletFundUrl();
    }

    if (projectId === null || address === undefined) {
      return undefined;
    }

    return getOnrampBuyUrl({
      projectId,
      addresses: { [address]: [chain.name.toLowerCase()] },
      fiatCurrency,
      originComponentName,
    });
  }, [
    isCoinbaseSmartWallet,
    projectId,
    address,
    chain,
    fiatCurrency,
    originComponentName,
  ]);
}
