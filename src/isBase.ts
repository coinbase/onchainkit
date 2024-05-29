import { isBaseOptions, isBaseResponse } from './types';
import { baseSepolia, base } from 'viem/chains';

/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Base and Base Sepolia chain ids
 */
export function isBase({ chainId }: isBaseOptions): isBaseResponse {
  if (chainId !== baseSepolia.id && chainId !== base.id) {
    return false;
  }

  return true;
}
