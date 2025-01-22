import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { GetAddress, GetAddressReturnType } from '@/identity/types';
import { mainnet } from 'viem/chains';

/**
 * Get address from ENS name or Basename.
 */
export const getAddress = async ({
  name,
  chain = mainnet,
}: GetAddress): Promise<GetAddressReturnType> => {
  const client = getChainPublicClient(chain);
  // Gets address for ENS name.
  const address = await client.getEnsAddress({
    name,
  });
  return address ?? null;
};
