import { publicClient } from '../../network/client';
import { getSlicedAddress } from '../getSlicedAddress';
import type { GetName, GetNameReturnType } from '../types';

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
export const getName = async ({
  address,
}: GetName): Promise<GetNameReturnType> => {
  const ensName = await publicClient.getEnsName({
    address,
  });

  return ensName ?? getSlicedAddress(address);
};
