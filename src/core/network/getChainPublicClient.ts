import { http, createPublicClient } from 'viem';
import type { Chain } from 'viem/chains';

export function getChainPublicClient(chain: Chain) {
  return createPublicClient({
    chain: chain,
    transport: http(),
  });
}
