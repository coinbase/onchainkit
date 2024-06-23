import { useQuery } from '@tanstack/react-query';
import type { GetAvatarReturnType } from '../types';
import { getAvatar } from '../core/getAvatar';

type UseAvatarOptions = {
  ensName: string;
};

type UseAvatarQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

/**
 * Gets an ensName and resolves the Avatar
 */
export const useAvatar = (
  { ensName }: UseAvatarOptions,
  queryOptions?: UseAvatarQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-avatar-${ensName}`;
  return useQuery<GetAvatarReturnType>({
    queryKey: ['useAvatar', ensActionKey],
    queryFn: async () => {
      return getAvatar({ ensName });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
