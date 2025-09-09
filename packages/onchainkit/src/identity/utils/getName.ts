import type { GetNameParams, GetNameReturnType } from '@/identity/types';
import { mainnet } from 'viem/chains';
import { getBaseName } from './getBaseName';
import { getMainnetName } from './getMainnetName';

/**
 * An asynchronous function to fetch names from multiple sources including
 * Base chain (Basenames), and Ethereum Name Service (ENS).
 *
 * Resolution order: Base Chain → ENS (Mainnet)
 *
 * @param params - Parameters for name resolution
 * @returns The resolved name if found, or null if not found
 */
export const getName = async ({
  address,
  chain = mainnet,
}: GetNameParams): Promise<GetNameReturnType> => {
  if (!address) {
    return null;
  }

  const baseName = await getBaseName(address, chain);
  if (baseName) {
    return baseName;
  }

  const mainnetName = await getMainnetName(address);
  if (mainnetName) {
    return mainnetName;
  }

  return null;
};
