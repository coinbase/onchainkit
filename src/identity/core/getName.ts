import { publicClient } from '../../network/client';
import type { Address, GetEnsNameReturnType } from 'viem';

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS) name for a given Ethereum address.
 * It returns the ENS name if it exists, or null if it doesn't or in case of an error.
 *
 * @param address - The Ethereum address for which the ENS name is being fetched.
 * @returns A promise that resolves to the ENS name (as a string) or null.
 */
export const getName = async (address: Address): Promise<GetEnsNameReturnType> => {
  return await publicClient.getEnsName({
    address,
  });
};
