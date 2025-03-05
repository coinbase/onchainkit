import { getAvatar } from '@/identity/utils/getAvatar';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetAvatarReturnType,
  UseAvatarOptions,
  UseQueryOptions,
} from '../types';

/**
 * Gets an ensName and resolves the Avatar
 */
export const useAvatar = (
  { ensName, chain = mainnet }: UseAvatarOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled, cacheTime, staleTime, refetchOnWindowFocus } = {
    ...DEFAULT_QUERY_OPTIONS,
    ...queryOptions,
  };

  const queryKey = ['useAvatar', ensName, chain.id];

  return useQuery<GetAvatarReturnType>({
    queryKey,
    queryFn: async () => {
      console.log(
        `[useAvatar] Cache MISS - Fetching avatar for ENS: ${ensName} on chain: ${chain.id}`,
      );
      const result = await getAvatar({ ensName, chain });
      console.log(`[useAvatar] Fetch completed with result:`, result);
      return result;
    },
    gcTime: cacheTime,
    staleTime: staleTime,
    enabled,
    refetchOnWindowFocus,
    select: (data: GetAvatarReturnType) => {
      console.log(`[useAvatar] Query SUCCESS - Data loaded`);
      return data;
    },
  });
};
