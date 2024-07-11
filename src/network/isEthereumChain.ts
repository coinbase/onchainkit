import { mainnet, sepolia } from 'viem/chains';

export const ETHEREUM_CHAINS_IDS: number[] = [mainnet.id, sepolia.id];

export function isEthereumChain(chainId: number) {
  return ETHEREUM_CHAINS_IDS.includes(chainId);
}
