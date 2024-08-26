import { mainnet } from 'viem/chains';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import type { GetAddress, GetAddressReturnType } from '../types';

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
