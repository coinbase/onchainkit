import { getNames } from '@/identity/utils/getNames';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetNameReturnType,
  UseNamesOptions,
  UseQueryOptions,
} from '../types';

/**
 * A React hook that leverages the `@tanstack/react-query` for fetching and optionally caching
 * multiple Basenames or ENS names in a single batch request.
 */
export const useNames = (
  { addresses, chain = mainnet }: UseNamesOptions,
  queryOptions?: UseQueryOptions<GetNameReturnType[]>,
) => {
  const addressesKey = addresses.join(',');
  const queryKey = ['useNames', addressesKey, chain.id];

  return useQuery<GetNameReturnType[]>({
    queryKey,
    queryFn: () => getNames({ addresses, chain }),
    enabled: !!addresses.length,
    ...DEFAULT_QUERY_OPTIONS,
    // Use cacheTime as gcTime for backward compatibility
    gcTime: queryOptions?.cacheTime,
    ...queryOptions,
  });
};
