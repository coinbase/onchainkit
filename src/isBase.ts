import { baseSepolia, base } from 'viem/chains';
import type { isBaseOptions } from './types';

/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Base and Base Sepolia chain ids
 */
export function isBase({ chainId }: isBaseOptions): boolean {
  if (chainId !== baseSepolia.id && chainId !== base.id) {
    return false;
  }
  return true;
}
