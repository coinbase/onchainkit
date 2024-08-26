import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetAvatarReturnType,
  UseAvatarOptions,
  UseQueryOptions,
} from '../types';
import { getAvatar } from '../utils/getAvatar';

/**
 * Gets an ensName and resolves the Avatar
 */
export const useAvatar = (
  { ensName, chain = mainnet }: UseAvatarOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-avatar-${ensName}-${chain.id}`;
  return useQuery<GetAvatarReturnType>({
    queryKey: ['useAvatar', ensActionKey],
    queryFn: async () => {
      return getAvatar({ ensName, chain });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
