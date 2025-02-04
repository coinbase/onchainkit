import { baseTokens } from '@/token/constants';
import type { Address } from 'viem';

/**
 * Internal
 * @param address
 * @returns Token from our known tokens list, or a fallback if it's unknown
 */
export function getTokenFromAddress(address: Address) {
  console.log('address:', address);

  return (
    baseTokens.find((token) => {
      console.log('token:', token);
      console.log('x:', token.address);
      console.log('y:', address);
      console.log('address === token.address:', address === token.address);
      return token.address === address;
    }) ?? baseTokens[0]
  );
}
