import { base, baseSepolia } from 'viem/chains';

/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Base and Base Sepolia chain ids
 */
function isBase({
  chainId,
  isMainnetOnly = false
}) {
  // If only Base mainnet
  if (isMainnetOnly && chainId === base.id) {
    return true;
  }
  // If only Base or Base Sepolia
  if (!isMainnetOnly && (chainId === baseSepolia.id || chainId === base.id)) {
    return true;
  }
  return false;
}
export { isBase };
//# sourceMappingURL=isBase.js.map
