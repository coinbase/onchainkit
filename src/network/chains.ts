import { createPublicClient, http } from 'viem';
import { Chain, base, baseSepolia, mainnet, sepolia } from 'viem/chains';

export const baseChainsIds: Chain['id'][] = [base.id, baseSepolia.id];
export const ensUniversalResolverChainIds: Chain['id'][] = [
  mainnet.id,
  sepolia.id,
  ...baseChainsIds,
];

export const chainsById: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
  [base.id]: base,
  [baseSepolia.id]: baseSepolia,
};

export function getChainPublicClient(chainId: number) {
  return createPublicClient({
    chain: chainsById[chainId],
    transport: http(),
  });
}
