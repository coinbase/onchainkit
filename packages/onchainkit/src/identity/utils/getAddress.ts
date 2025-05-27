import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { GetAddress, GetAddressReturnType } from '@/identity/types';
import { mainnet } from 'viem/chains';

const mainnetClient = getChainPublicClient(mainnet);

/**
 * Get address from ENS name or Basename.
 */
export const getAddress = async ({
  name,
}: GetAddress): Promise<GetAddressReturnType> => {
  // Gets address for ENS name.
  const address = await mainnetClient.getEnsAddress({
    name,
  });

  return address ?? null;
};
