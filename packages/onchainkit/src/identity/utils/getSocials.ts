import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import type { GetSocialsReturnType } from '@/identity/types';
import type { Chain } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

export type GetSocials = {
  ensName: string;
  chain?: Chain;
};

export const getSocials = async ({
  ensName,
}: GetSocials): Promise<GetSocialsReturnType> => {
  const client = getChainPublicClient(mainnet);
  const normalizedName = normalize(ensName);

  const fetchTextRecord = async (key: string) => {
    try {
      const result = await client.getEnsText({
        name: normalizedName,
        key,
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
