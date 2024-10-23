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
  console.log('getSocials ensName', ensName);
  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;
  // const usernameIsBasename = isBasename(ensName);

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, socials resolution is only supported on Ethereum and Base.',
    );
  }

  const client = getChainPublicClient(chain);
  const normalizedName = normalize(ensName);

  // const twitterText = await publicClient.getEnsText({
  //   name: normalizedAddress,
  //   key: 'com.twitter',
  //   universalResolverAddress: BASENAME_L2_RESOLVER_ADDRESS,
  // });

  const fetchTextRecord = async (key: string) => {
    const result = await client.getEnsText({
      name: normalizedName,
      key,
      universalResolverAddress: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
    });
    console.log('getSocials result', result);
    return result || null;
  };

  const [twitter, github, farcaster, url] = await Promise.all([
    fetchTextRecord('com.twitter'),
    fetchTextRecord('com.github'),
    fetchTextRecord('xyz.farcaster'),
    fetchTextRecord('url'),
  ]);

  return { twitter, github, farcaster, url };
};
