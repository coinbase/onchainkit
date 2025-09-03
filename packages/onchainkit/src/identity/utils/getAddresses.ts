import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type {
  GetAddressReturnType,
  GetAddressesParams,
} from '@/identity/types';
import { mainnet } from 'viem/chains';

/**
 * An asynchronous function to fetch multiple Ethereum addresses from ENS names or Basenames
 * in a single batch request.
 */
export const getAddresses = async ({
  names,
}: GetAddressesParams): Promise<GetAddressReturnType[]> => {
  if (!names || names.length === 0) {
    return [];
  }

  const mainnetClient = getChainPublicClient(mainnet);
  const results: GetAddressReturnType[] = Array(names.length).fill(null);

  try {
    // Filter out null or undefined names
    const validItems = names
      .map((name, index) => (name ? { name, index } : null))
      .filter((item): item is { name: string; index: number } => item !== null);

    if (validItems.length === 0) {
      return results;
    }

    const addressPromises = validItems.map(({ name, index }) =>
      mainnetClient
        .getEnsAddress({
          name,
        })
        .then((address) => {
          return { index, address };
        })
        .catch((error) => {
          console.error(`Error resolving address for ${name}:`, error);
          // Return null for the address if resolution fails
          return { index, address: null };
        }),
    );

    const resolvedAddresses = await Promise.all(addressPromises);

    // Update results array with resolved addresses
    resolvedAddresses.forEach(({ index, address }) => {
      results[index] = address;
    });
  } catch (error) {
    console.error('Error resolving addresses in batch:', error);
    return Array(names.length).fill(null);
  }

  return results;
};
