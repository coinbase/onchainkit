import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import type { GetEnsAvatarReturnType } from 'wagmi/actions';
import { isBase } from '../../isBase';
import { isEthereum } from '../../isEthereum';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import type { GetAvatar, GetAvatarReturnType } from '../types';

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
        return baseEnsAvatar as GetEnsAvatarReturnType;
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
