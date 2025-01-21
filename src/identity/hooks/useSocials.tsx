import { useQuery } from '@tanstack/react-query';
import type { Chain } from 'viem';
import { mainnet } from 'viem/chains';
import { getSocials } from '../../../identity/utils/getSocials';
import type { GetSocialsReturnType, UseQueryOptions } from '../types';

type UseSocialsOptions = {
  ensName: string;
  chain?: Chain;
};

export const useSocials = (
  { ensName, chain = mainnet }: UseSocialsOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-socials-${ensName}-${chain.id}`;
  return useQuery<GetSocialsReturnType>({
    queryKey: ['useSocials', ensActionKey],
    queryFn: async () => {
      return getSocials({ ensName, chain });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
