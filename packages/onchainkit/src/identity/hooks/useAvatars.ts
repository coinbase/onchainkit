import { getAvatars } from '@/identity/utils/getAvatars';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetAvatarReturnType,
  UseAvatarsOptions,
  UseQueryOptions,
} from '../types';

/**
 * A React hook that leverages the `@tanstack/react-query` for fetching and optionally caching
 * multiple Basenames or ENS avatars in a single batch request.
 */
export const useAvatars = (
  { ensNames, chain = mainnet }: UseAvatarsOptions,
  queryOptions?: UseQueryOptions<GetAvatarReturnType[]>,
) => {
  const namesKey = ensNames.join(',');
  const queryKey = ['useAvatars', namesKey, chain.id];

  return useQuery<GetAvatarReturnType[]>({
    queryKey,
    queryFn: () => getAvatars({ ensNames, chain }),
    enabled: !!ensNames.length,
    ...DEFAULT_QUERY_OPTIONS,
    gcTime: queryOptions?.cacheTime,
    ...queryOptions,
  });
};
