import { baseSepolia } from 'viem/chains';

export function getChainExplorer(chainId?: number) {
  if (chainId === baseSepolia.id) {
    return 'https://sepolia.basescan.org';
  }
  return 'https://basescan.org';
}
