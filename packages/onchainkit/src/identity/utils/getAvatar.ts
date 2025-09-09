import type { GetAvatarParams, GetAvatarReturnType } from '@/identity/types';
import { mainnet } from 'viem/chains';
import { getBaseAvatar } from './getBaseAvatar';
import { getMainnetAvatar } from './getMainnetAvatar';

/**
 * An asynchronous function to fetch avatars from multiple sources including
 * Base chain (Basenames), and Ethereum Name Service (ENS).
 *
 * Resolution order: Base Chain → ENS (Mainnet)
 *
 * @param params - Parameters for avatar resolution
 * @param params.ensName - The ENS name or identifier to resolve
 * @param params.chain - Optional chain for domain resolution
 * @returns The resolved avatar URL if found, or null if not found
 */
export const getAvatar = async ({
  ensName,
  chain = mainnet,
}: GetAvatarParams): Promise<GetAvatarReturnType> => {
  if (!ensName) {
    return null;
  }

  const baseAvatar = await getBaseAvatar(ensName, chain);
  if (baseAvatar) {
    return baseAvatar;
  }

  const mainnetAvatar = await getMainnetAvatar(ensName);
  if (mainnetAvatar) {
    return mainnetAvatar;
  }

  return null;
};
