import { isBaseOptions, isBaseResponse } from '../types';
import { baseSepolia, base } from 'viem/chains';

/**
 * isBase
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the base and baseSepolia chain ids
 */
export function isBase({ chainId }: isBaseOptions): isBaseResponse {
  if (chainId !== baseSepolia.id && chainId !== base.id) {
    return { isValid: false, error: 'Invalid chain id', code: 'W_ERR_1' };
  }

  return { isValid: true };
}
