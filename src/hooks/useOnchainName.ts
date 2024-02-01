import { publicClient } from '../network/client';
import { useOnchainActionWithCache } from './useOnchainActionWithCache';
import type { Address, GetEnsNameReturnType } from 'viem';

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS) name for a given Ethereum address.
 * It returns the ENS name if it exists, or null if it doesn't or in case of an error.
 *
 * @param address - The Ethereum address for which the ENS name is being fetched.
 * @returns A promise that resolves to the ENS name (as a string) or null.
 */
export const ensNameAction = (address: Address) => async (): Promise<GetEnsNameReturnType> => {
  try {
    return await publicClient.getEnsName({
      address,
    });
  } catch (err) {
    return null;
  }
};

/**
 * It leverages the `useOnchainActionWithCache` hook for fetching and optionally caching the ENS name,
 * handling loading state internally.
 * @param address - The Ethereum address for which the ENS name is to be fetched.
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `isLoading`: A boolean indicating whether the ENS name is currently being fetched.
 */
export const useOnchainName = (address: Address) => {
  const ensActionKey = `ens-name-${address}`;
  const { data: ensName, isLoading } = useOnchainActionWithCache(
    ensNameAction(address),
    ensActionKey,
  );
  return { ensName, isLoading };
};
