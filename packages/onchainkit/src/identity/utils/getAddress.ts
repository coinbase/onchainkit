import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { GetAddressParams, GetAddressReturnType } from '@/identity/types';
import { mainnet } from 'viem/chains';

/**
 * Get address from ENS name or Basename.
 */
export const getAddress = async ({
  name,
}: GetAddressParams): Promise<GetAddressReturnType> => {
  const mainnetClient = getChainPublicClient(mainnet);
  
  // Gets address for ENS name.
  const address = await mainnetClient.getEnsAddress({
    name,
  });

  return address ?? null;
};
