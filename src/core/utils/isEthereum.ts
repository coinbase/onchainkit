import { mainnet, sepolia } from 'viem/chains';
import type { IsEthereumOptions } from '../types';

/**
 * isEthereum
 *  - Checks if the chain is mainnet or sepolia
 */
export function isEthereum({
  chainId,
  isMainnetOnly = false,
}: IsEthereumOptions): boolean {
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
