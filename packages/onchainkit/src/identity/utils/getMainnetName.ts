import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { Address } from 'viem';
import { mainnet } from 'viem/chains';
import { getAddress } from './getAddress';

/**
 * Get ENS name from Ethereum mainnet for an address
 */
export const getMainnetName = async (
  address: Address,
): Promise<string | null> => {
  if (!address) {
    return null;
  }

  try {
    const client = getChainPublicClient(mainnet);

    const ensName = await client.getEnsName({
      address,
    });

    if (!ensName) {
      return null;
    }

    try {
      const resolvedAddress = await getAddress({
        name: ensName,
      });

      if (
        resolvedAddress &&
        resolvedAddress.toLowerCase() === address.toLowerCase()
      ) {
        return ensName;
      }
    } catch (error) {
      console.error('Error during ENS forward resolution verification:', error);
    }

    return null;
  } catch (error) {
    console.error('ENS name resolution failed:', error);
    return null;
  }
};
