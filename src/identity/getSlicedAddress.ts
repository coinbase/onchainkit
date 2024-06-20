import type { Address } from 'viem';

/**
 * Returns the first 5 and last 4 characters of an address.
 */
export const getSlicedAddress = (address: Address) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};
