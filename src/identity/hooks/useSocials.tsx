import type { GetSocialsReturnType, UseQueryOptions } from '@/identity/types';
import { getSocials } from '@/identity/utils/getSocials';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import type { Chain } from 'viem';
import { mainnet } from 'viem/chains';

type UseSocialsOptions = {
  ensName: string;
  chain?: Chain;
};

export const useSocials = (
  { ensName, chain = mainnet }: UseSocialsOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled, cacheTime, staleTime, refetchOnWindowFocus } = {
    ...DEFAULT_QUERY_OPTIONS,
    ...queryOptions,
  };

  const queryKey = ['useSocials', ensName, chain.id];

  return useQuery<GetSocialsReturnType>({
    queryKey,
    queryFn: async () => {
      console.log(
        `[useSocials] Cache MISS - Fetching socials for ENS: ${ensName} on chain: ${chain.id}`,
      );
      const result = await getSocials({ ensName, chain });
      console.log(`[useSocials] Fetch completed with result:`, result);
      return result;
    },
    gcTime: cacheTime,
    staleTime: staleTime,
    enabled,
    refetchOnWindowFocus,
    select: (data: GetSocialsReturnType) => {
      console.log(`[useSocials] Query SUCCESS - Data loaded`);
      return data;
    },
  });
};
