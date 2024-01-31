import { publicClient } from '../store/client';
import { inMemoryStorageService } from '../store/storageServices';
import { useOnchainActionWithCache } from './useOnchainActionWithCache';
import type { Address, GetEnsNameReturnType } from 'viem';
export const ensNameAction = (address?: Address) => async (): Promise<GetEnsNameReturnType> => {
  if (!address) return null;
  try {
    return await publicClient.getEnsName({
      address,
    });
  } catch (err) {
    return null;
  }
};

/**
 * Fetches the ENS name for a given address.
 */
export const useEnsName = (address?: Address) => {
  const ensActionKey = `ens-name-${address}`;
  const ensName = useOnchainActionWithCache(
    ensNameAction(address),
    ensActionKey,
    inMemoryStorageService,
  );
  return { ensName };
};
