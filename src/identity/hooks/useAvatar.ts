import { publicClient } from '../../network/client';
import { type GetEnsAvatarReturnType, normalize } from 'viem/ens';
import { useQuery } from '@tanstack/react-query';

// Since ENS values are not as crucial and not changing often, we can cache them
const DEFAULT_ENS_CACHE_TIME = 2 * 60 * 1000; // 2 minutes

export const ensAvatarAction = async (ensName: string): Promise<GetEnsAvatarReturnType> => {
  return await publicClient.getEnsAvatar({
    name: normalize(ensName),
  });
};

type Arguments = {
  ensName: string;
};

type QueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

export const useAvatar = ({ ensName }: Arguments, queryOptions?: QueryOptions) => {
  const { enabled = true, cacheTime = DEFAULT_ENS_CACHE_TIME } = queryOptions ?? {};
  const ensActionKey = `ens-avatar-${ensName}` ?? '';
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
