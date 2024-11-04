import { mainnet, sepolia } from 'viem/chains';

/**
 * isEthereum
 *  - Checks if the chain is mainnet or sepolia
 */
function isEthereum({
  chainId,
  isMainnetOnly = false
}) {
  // If only ETH mainnet
  if (isMainnetOnly && chainId === mainnet.id) {
    return true;
  }
  // If only ETH or ETH Sepolia
  if (!isMainnetOnly && (chainId === sepolia.id || chainId === mainnet.id)) {
    return true;
  }
  return false;
}
export { isEthereum };
//# sourceMappingURL=isEthereum.js.map
