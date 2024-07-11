import { mainnet, sepolia } from 'viem/chains';
import type { Chain } from 'viem/chains';

export const ETHEREUM_CHAINS_BY_CHAIN_ID: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
};
export const ETHEREUM_CHAINS_IDS: number[] = Object.keys(
  ETHEREUM_CHAINS_BY_CHAIN_ID,
).map((id) => Number(id));

export function isEthereumChain(chainId: number) {
  return ETHEREUM_CHAINS_IDS.includes(chainId);
}
