import { base, baseSepolia } from 'viem/chains';
import type { IsBaseOptions } from '../types';

/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Base and Base Sepolia chain ids
 */
export function isBase({
  chainId,
  isMainnetOnly = false,
}: IsBaseOptions): boolean {
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
