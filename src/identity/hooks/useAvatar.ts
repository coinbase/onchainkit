import { type GetEnsAvatarReturnType } from 'viem/ens';
import { useQuery } from '@tanstack/react-query';
import { getAvatar } from '../core/getAvatar';

type UseNameOptions = {
  ensName: string;
};

type UseNameQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

/**
 * Gets an ensName and resolves the Avatar
 */
export const useAvatar = ({ ensName }: UseNameOptions, queryOptions?: UseNameQueryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-avatar-${ensName}`;
  return useQuery<GetEnsAvatarReturnType>({
    queryKey: ['useAvatar', ensActionKey],
    queryFn: async () => {
      return await getAvatar(ensName);
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
