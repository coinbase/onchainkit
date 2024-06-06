import { useQuery } from '@tanstack/react-query';
import type { GetEnsAvatarReturnType } from '../types';
import { getEnsAvatar } from '../core/getEnsAvatar';

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
export const useAvatar = ({ ensName }: UseAvatarOptions, queryOptions?: UseAvatarQueryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-avatar-${ensName}`;
  return useQuery<GetEnsAvatarReturnType>({
    queryKey: ['useEnsAvatar', ensActionKey],
    queryFn: async () => {
      return getEnsAvatar({ name: ensName });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
