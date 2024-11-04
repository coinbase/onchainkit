import { baseSepolia } from 'viem/chains';
function getChainExplorer(chainId) {
  if (chainId === baseSepolia.id) {
    return 'https://sepolia.basescan.org';
  }
  return 'https://basescan.org';
}
export { getChainExplorer };
//# sourceMappingURL=getChainExplorer.js.map
