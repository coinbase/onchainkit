import { baseTokens } from '@/token/constants';
import type { Address } from 'viem';

/**
 * Internal
 * @param address
 * @returns Token from our known tokens list, or a fallback if it's unknown
 */
export function getTokenFromAddress(address: Address) {
  console.log('address:', address);

  return baseTokens.find((token) => token.address === address) ?? baseTokens[0];
}
