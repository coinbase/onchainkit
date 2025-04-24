import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  sepolia,
} from 'viem/chains';

const chainExplorerMap: Record<number, string> = {
  [baseSepolia.id]: 'https://sepolia.basescan.org',
  [base.id]: 'https://basescan.org',
  [arbitrum.id]: 'https://arbiscan.io',
  [arbitrumSepolia.id]: 'https://sepolia.arbiscan.io',
  [optimism.id]: 'https://optimistic.etherscan.io',
  [optimismSepolia.id]: 'https://sepolia-optimism.etherscan.io/',
  [polygon.id]: 'https://polygonscan.com',
  [polygonMumbai.id]: 'https://mumbai.polygonscan.com',
  [mainnet.id]: 'https://etherscan.io',
  [sepolia.id]: 'https://sepolia.etherscan.io',
};

export function getChainExplorer(chainId?: number) {
  if (!chainId) {
    return 'https://basescan.org';
  }

  return chainExplorerMap[chainId] ?? 'https://basescan.org';
}
