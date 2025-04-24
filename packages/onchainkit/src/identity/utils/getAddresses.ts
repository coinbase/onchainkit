import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { isBase } from '@/core/utils/isBase';
import { isEthereum } from '@/core/utils/isEthereum';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '@/identity/constants';
import type { GetAddressReturnType, GetAddresses } from '@/identity/types';
import { isBasename } from '@/identity/utils/isBasename';
import { mainnet } from 'viem/chains';

/**
 * An asynchronous function to fetch multiple Ethereum addresses from ENS names or Basenames
 * in a single batch request.
 */
export const getAddresses = async ({
  names,
  chain = mainnet,
}: GetAddresses): Promise<GetAddressReturnType[]> => {
  if (!names || names.length === 0) {
    return [];
  }

  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  }

  const client = getChainPublicClient(chain);
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
      client
        .getEnsAddress({
          name,
          universalResolverAddress: isBasename(name)
            ? RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id]
            : undefined,
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
