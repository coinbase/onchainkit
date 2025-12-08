import { http, createPublicClient } from 'viem';
import { base, baseSepolia, type Chain } from 'viem/chains';
import { getOnchainKitConfig } from '../OnchainKitConfig';

export function getChainPublicClient(chain: Chain) {
  const apiKey = getOnchainKitConfig('apiKey');
  const defaultPublicClients = getOnchainKitConfig('defaultPublicClients');

  if (defaultPublicClients?.[chain.id]) {
    return defaultPublicClients?.[chain.id];
  }

  if (apiKey && (chain === base || chain === baseSepolia)) {
    const network = chain === base ? 'base' : 'base-sepolia';
    return createPublicClient({
      chain: chain,
      transport: http(
        `https://api.developer.coinbase.com/rpc/v1/${network}/${apiKey}`,
      ),
    });
  }

  return createPublicClient({
    chain: chain,
    transport: http(),
  });
}
