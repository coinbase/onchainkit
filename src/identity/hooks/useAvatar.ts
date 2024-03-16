import { publicClient } from '../../network/client';
import { type GetEnsAvatarReturnType, normalize } from 'viem/ens';
import { useQuery } from '@tanstack/react-query';

export const ensAvatarAction = async (ensName: string): Promise<GetEnsAvatarReturnType> => {
  return await publicClient.getEnsAvatar({
    name: normalize(ensName),
  });
};

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
      return await ensAvatarAction(ensName);
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
