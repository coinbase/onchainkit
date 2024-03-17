/**
 * Returns the first 5 and last 4 characters of an address.
 */
export const getSlicedAddress = (address: `0x${string}`) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
};
