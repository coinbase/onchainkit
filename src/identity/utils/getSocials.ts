import type { Chain } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';
import { isBase } from '../../isBase';
import { isEthereum } from '../../isEthereum';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import type { GetSocialsReturnType } from '../types';

export type GetSocials = {
  ensName: string;
  chain?: Chain;
};

export const getSocials = async ({
  ensName,
  chain = mainnet,
}: GetSocials): Promise<GetSocialsReturnType> => {
  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, socials resolution is only supported on Ethereum and Base.',
    );
  }

  const client = getChainPublicClient(chain);
  const normalizedName = normalize(ensName);

  const fetchTextRecord = async (key: string) => {
    try {
      const result = await client.getEnsText({
        name: normalizedName,
        key,
        universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
      });
      return result || null;
    } catch (error) {
      console.warn(`Failed to fetch ENS text record for ${key}:`, error);
      return null;
    }
  };

  const [twitter, github, farcaster, website] = await Promise.all([
    fetchTextRecord('com.twitter'),
    fetchTextRecord('com.github'),
    fetchTextRecord('xyz.farcaster'),
    fetchTextRecord('url'),
  ]);

  return { twitter, github, farcaster, website };
};
