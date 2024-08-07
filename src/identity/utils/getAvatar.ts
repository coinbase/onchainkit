import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { isBase } from '../../isBase';
import { isEthereum } from '../../isEthereum';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import type { GetAvatar, GetAvatarReturnType } from '../types';

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

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, avatar resolution is only supported on Ethereum and Base.',
    );
  }

  let client = getChainPublicClient(chain);

  if (chainIsBase) {
    try {
      const baseEnsAvatar = await client.getEnsAvatar({
        name: normalize(ensName),
        universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
      });

      if (baseEnsAvatar) {
        return baseEnsAvatar;
      }
    } catch (_error) {
      // This is a best effort attempt, so we don't need to do anything here.
    }
  }

  // Default to mainnet
  client = getChainPublicClient(mainnet);
  return await client.getEnsAvatar({
    name: normalize(ensName),
  });
};
