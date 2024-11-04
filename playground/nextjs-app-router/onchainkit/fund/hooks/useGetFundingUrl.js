import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useOnchainKit } from '../../useOnchainKit.js';
import { useIsWalletACoinbaseSmartWallet } from '../../wallet/hooks/useIsWalletACoinbaseSmartWallet.js';
import { getCoinbaseSmartWalletFundUrl } from '../utils/getCoinbaseSmartWalletFundUrl.js';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl.js';

/**
 * Gets the correct funding URL based on the connected wallet. If a Coinbase Smart Wallet is connected it will send the
 * user to keys.coinbase.com, otherwise it will send them to pay.coinbase.com.
 * @returns the funding URL and optional popup dimensions if the URL requires them
 */
function useGetFundingUrl() {
  const _useOnchainKit = useOnchainKit(),
    projectId = _useOnchainKit.projectId,
    defaultChain = _useOnchainKit.chain;
  const _useAccount = useAccount(),
    address = _useAccount.address,
    accountChain = _useAccount.chain;
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
      addresses: {
        [address]: [chain.name.toLowerCase()]
      }
    });
  }, [isCoinbaseSmartWallet, projectId, address, chain]);
}
export { useGetFundingUrl };
//# sourceMappingURL=useGetFundingUrl.js.map