import { getAvatar } from '@/identity/utils/getAvatar';
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
  const { enabled = true, cacheTime } = queryOptions ?? {};
  return useQuery<GetAvatarReturnType>({
    queryKey: ['useAvatar', ensName, chain.id],
    queryFn: async () => {
      return getAvatar({ ensName, chain });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
