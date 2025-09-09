import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { isBase } from '@/core/utils/isBase';
import type { Chain } from 'viem';
import { normalize } from 'viem/ens';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getBaseDefaultProfilePicture } from './getBaseDefaultProfilePicture';
import { isBasename } from './isBasename';
import type { Basename } from '../types';

/**
 * Get Base chain avatar for an ENS name or Basename
 */
export const getBaseAvatar = async (
  ensName: string,
  chain: Chain,
): Promise<string | null> => {
  if (!ensName || !chain || !isBase({ chainId: chain.id })) {
    return null;
  }

  try {
    const client = getChainPublicClient(chain);

    const baseEnsAvatar = await client.getEnsAvatar({
      name: normalize(ensName),
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
    });

    if (baseEnsAvatar) {
      return baseEnsAvatar;
    }

    if (isBasename(ensName)) {
      const defaultAvatar = getBaseDefaultProfilePicture(ensName as Basename);
      return defaultAvatar;
    }

    return null;
  } catch (error) {
    console.error('Base chain avatar resolution failed:', error);
    return null;
  }
};
