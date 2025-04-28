import { http, createPublicClient } from 'viem';
import { base, baseSepolia, type Chain } from 'viem/chains';
import { getOnchainKitConfig } from '../OnchainKitConfig';

export function getChainPublicClient(chain: Chain) {
  const apiKey = getOnchainKitConfig('apiKey');
  const rpcUrl =
    chain === base
      ? 'https://api.developer.coinbase.com/rpc/v1/base'
      : 'https://api.developer.coinbase.com/rpc/v1/base-sepolia';
  const useCustomRpc = (chain === base || chain === baseSepolia) && !!apiKey;
  return createPublicClient({
    chain: chain,
    transport: useCustomRpc ? http(`${rpcUrl}/${apiKey}`) : http(),
  });
}
