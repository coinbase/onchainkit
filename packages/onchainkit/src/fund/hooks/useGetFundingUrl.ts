import { useMemo } from 'react';
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
  sessionToken,
}: {
  fiatCurrency?: string;
  originComponentName?: string;
  sessionToken?: string;
}): string | undefined {
  const isCoinbaseSmartWallet = useIsWalletACoinbaseSmartWallet();

  return useMemo(() => {
    if (isCoinbaseSmartWallet) {
      return getCoinbaseSmartWalletFundUrl();
    }

    if (!sessionToken) {
      return undefined;
    }

    return getOnrampBuyUrl({
      sessionToken,
      fiatCurrency,
      originComponentName,
    });
  }, [isCoinbaseSmartWallet, sessionToken, fiatCurrency, originComponentName]);
}
