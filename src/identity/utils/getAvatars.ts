import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { isBase } from '@/core/utils/isBase';
import { isEthereum } from '@/core/utils/isEthereum';
import type { Basename, GetAvatarReturnType } from '@/identity/types';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getBaseDefaultProfilePicture } from './getBaseDefaultProfilePicture';
import { isBasename } from './isBasename';

export type GetAvatars = {
  ensNames: string[];
  chain?: typeof mainnet;
};

/**
 * An asynchronous function to fetch multiple Basenames or Ethereum Name Service (ENS)
 * avatars for a given array of ENS names in a single batch request.
 * It returns an array of avatar URLs in the same order as the input names.
 */
export const getAvatars = async ({
  ensNames,
  chain = mainnet,
}: GetAvatars): Promise<GetAvatarReturnType[]> => {
  if (!ensNames || ensNames.length === 0) {
    return [];
  }

  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
    );
  }

  // Initialize results array
  const results: GetAvatarReturnType[] = Array(ensNames.length).fill(null);

  // Categorize names by type for optimized processing
  const basenameIndices: number[] = [];
  const normalIndices: number[] = [];

  ensNames.forEach((name, index) => {
    if (isBasename(name)) {
      basenameIndices.push(index);
    } else {
      normalIndices.push(index);
    }
  });

  // Process Base chain avatars if applicable
  if (chainIsBase && basenameIndices.length > 0) {
    const client = getChainPublicClient(chain);

    try {
      // Create batch of calls for Base avatars
      const baseAvatarPromises = basenameIndices.map((index) =>
        client.getEnsAvatar({
          name: normalize(ensNames[index]),
          universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        }),
      );

      // Execute all Base avatar resolution calls
      const baseAvatarResults = await Promise.all(baseAvatarPromises);

      // Update results with Base avatars
      baseAvatarResults.forEach((avatar, i) => {
        const originalIndex = basenameIndices[i];
        if (avatar) {
          results[originalIndex] = avatar;
        }
      });
    } catch (error) {
      // This is a best effort attempt, so we continue to fallback
      console.error('Error resolving Base avatars in batch:', error);
    }
  }

  // Process mainnet avatars for all names
  const fallbackClient = getChainPublicClient(mainnet);

  // For all names, try mainnet resolution
  try {
    // Create batch of ENS avatar resolution calls
    const ensAvatarPromises = ensNames.map((name, index) => {
      // Skip if we already have a result
      if (results[index] !== null) {
        return Promise.resolve(null);
      }
      return fallbackClient.getEnsAvatar({
        name: normalize(name),
      });
    });

    // Execute all ENS avatar resolution calls
    const ensAvatarResults = await Promise.all(ensAvatarPromises);

    // Update results with ENS avatars
    ensAvatarResults.forEach((avatar, index) => {
      if (avatar && results[index] === null) {
        results[index] = avatar;
      }
    });
  } catch (error) {
    console.error('Error resolving ENS avatars in batch:', error);
  }

  // Apply default Base profile pictures for basenames that don't have avatars
  basenameIndices.forEach((index) => {
    if (results[index] === null) {
      results[index] = getBaseDefaultProfilePicture(
        ensNames[index] as Basename,
      );
    }
  });

  return results;
};
