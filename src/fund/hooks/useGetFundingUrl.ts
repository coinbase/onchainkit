import { useMemo } from 'react';
import { useOnchainKit } from '../../useOnchainKit';
import { useIsWalletACoinbaseSmartWallet } from '../../wallet/hooks/useIsWalletACoinbaseSmartWallet';
import { getCoinbaseSmartWalletFundUrl } from '../utils/getCoinbaseSmartWalletFundUrl';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl';
import { useWalletAddress } from './useWalletAddress';

/**
 * Gets the correct funding URL based on the connected wallet. If a Coinbase Smart Wallet is connected it will send the
 * user to keys.coinbase.com, otherwise it will send them to pay.coinbase.com.
 * @returns the funding URL and optional popup dimensions if the URL requires them
 */
export function useGetFundingUrl({
  fiatCurrency,
  originComponentName,
  walletAddress,
  walletNetwork,
}: {
  fiatCurrency?: string;
  originComponentName?: string;
  walletAddress?: string;
  walletNetwork?: string;
}): string | undefined {
  const { projectId } = useOnchainKit();

  const isCoinbaseSmartWallet = useIsWalletACoinbaseSmartWallet();

  const { address, network } = useWalletAddress({
    walletAddress,
    walletNetwork,
  });

  return useMemo(() => {
    if (isCoinbaseSmartWallet) {
      return getCoinbaseSmartWalletFundUrl();
    }

    if (projectId === null || address === undefined) {
      return undefined;
    }

    return getOnrampBuyUrl({
      projectId,
      addresses: { [address]: [network] },
      fiatCurrency,
      originComponentName,
    });
  }, [
    isCoinbaseSmartWallet,
    projectId,
    address,
    network,
    fiatCurrency,
    originComponentName,
  ]);
}
