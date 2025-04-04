import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { isBase } from '@/core/utils/isBase';
import { isEthereum } from '@/core/utils/isEthereum';
import type {
  Basename,
  GetAvatar,
  GetAvatarReturnType,
} from '@/identity/types';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { getBaseDefaultProfilePicture } from './getBaseDefaultProfilePicture';
import { isBasename } from './isBasename';

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * avatar for a given Ethereum name. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
export const getAvatar = async ({
  ensName,
  chain = mainnet,
}: GetAvatar): Promise<GetAvatarReturnType> => {
  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  const usernameIsBasename = isBasename(ensName);

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
    );
  }

  let client = getChainPublicClient(chain);
  let baseEnsAvatar = null;

  // 1. Try basename
  if (chainIsBase) {
    try {
      baseEnsAvatar = await client.getEnsAvatar({
        name: normalize(ensName),
        universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
      });

      if (baseEnsAvatar) {
        return baseEnsAvatar;
      }
    } catch {
      // This is a best effort attempt, so we don't need to do anything here.
    }
  }

  // 2. Defaults to mainnet
  client = getChainPublicClient(mainnet);
  const mainnetEnsAvatar = await client.getEnsAvatar({
    name: normalize(ensName),
  });

  if (mainnetEnsAvatar) {
    return mainnetEnsAvatar;
  }

  // 3. If username is a Basename (.base.eth / .basetest.eth), use default Basename avatars
  if (usernameIsBasename) {
    return getBaseDefaultProfilePicture(ensName as Basename);
  }

  // 4. No avatars to display
  return null;
};
