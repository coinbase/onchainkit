import type { GetNameReturnType, GetNamesParams } from '@/identity/types';
import { mainnet } from 'viem/chains';
import { getBaseName } from './getBaseName';
import { getMainnetName } from './getMainnetName';

/**
 * An asynchronous function to fetch multiple names from Base chain (Basenames),
 * and Ethereum Name Service (ENS) for a given array of Ethereum addresses.
 * It returns an array of names in the same order as the input addresses.
 *
 * Resolution order: Base Chain → ENS (Mainnet)
 */
export const getNames = async ({
  addresses,
  chain = mainnet,
}: GetNamesParams): Promise<GetNameReturnType[]> => {
  if (!addresses || addresses.length === 0) {
    return [];
  }

  const results: GetNameReturnType[] = Array(addresses.length).fill(null);

  const namePromises = addresses.map(async (address, index) => {
    if (!address) {
      return { index, name: null };
    }

    const baseName = await getBaseName(address, chain);
    if (baseName) {
      return { index, name: baseName };
    }

    const mainnetName = await getMainnetName(address);
    if (mainnetName) {
      return { index, name: mainnetName };
    }

    return { index, name: null };
  });

  try {
    const resolvedNames = await Promise.all(namePromises);

    for (const { index, name } of resolvedNames) {
      results[index] = name;
    }
  } catch (error) {
    console.error('Error resolving names in batch:', error);
    return Array(addresses.length).fill(null);
  }

  return results;
};
