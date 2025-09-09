import type { GetAvatarReturnType, GetAvatarsParams } from '@/identity/types';
import { mainnet } from 'viem/chains';
import { getBaseAvatar } from './getBaseAvatar';
import { getMainnetAvatar } from './getMainnetAvatar';

/**
 * An asynchronous function to fetch multiple avatars from Base chain (Basenames),
 * and Ethereum Name Service (ENS) for a given array of ENS names.
 * It returns an array of avatar URLs in the same order as the input names.
 *
 * Resolution order: Base Chain → ENS (Mainnet)
 */
export const getAvatars = async ({
  ensNames,
  chain = mainnet,
}: GetAvatarsParams): Promise<GetAvatarReturnType[]> => {
  if (!ensNames || ensNames.length === 0) {
    return [];
  }

  const results: GetAvatarReturnType[] = Array(ensNames.length).fill(null);

  const avatarPromises = ensNames.map(async (ensName, index) => {
    if (!ensName) {
      return { index, avatar: null };
    }

    const baseAvatar = await getBaseAvatar(ensName, chain);
    if (baseAvatar) {
      return { index, avatar: baseAvatar };
    }

    const mainnetAvatar = await getMainnetAvatar(ensName);
    if (mainnetAvatar) {
      return { index, avatar: mainnetAvatar };
    }

    return { index, avatar: null };
  });

  try {
    const resolvedAvatars = await Promise.all(avatarPromises);

    for (const { index, avatar } of resolvedAvatars) {
      results[index] = avatar;
    }
  } catch (error) {
    console.error('Error resolving avatars in batch:', error);
    return Array(ensNames.length).fill(null);
  }

  return results;
};
