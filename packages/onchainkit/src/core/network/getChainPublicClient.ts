import { http, createPublicClient } from 'viem';
import { base, type Chain } from 'viem/chains';
import { getOnchainKitConfig } from '../OnchainKitConfig';

export function getChainPublicClient(chain: Chain) {
  const apiKey = getOnchainKitConfig('apiKey');
  const rpcUrl =
    chain === base
      ? 'https://api.developer.coinbase.com/rpc/v1/base'
      : 'https://api.developer.coinbase.com/rpc/v1/base-sepolia';
  return createPublicClient({
    chain: chain,
    transport: apiKey ? http(`${rpcUrl}/${apiKey}`) : http(),
  });
}
