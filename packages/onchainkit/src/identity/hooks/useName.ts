import { getName } from '@/identity/utils/getName';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetNameReturnType,
  UseNameParams,
  UseQueryOptions,
} from '../types';

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 */
export const useName = (
  { address, chain = mainnet }: UseNameParams,
  queryOptions?: UseQueryOptions<GetNameReturnType>,
) => {
  const queryKey = ['useName', address, chain.id];

  return useQuery<GetNameReturnType>({
    queryKey,
    queryFn: () => getName({ address, chain }),
    enabled: !!address,
    ...DEFAULT_QUERY_OPTIONS,
    // Use cacheTime as gcTime for backward compatibility
    gcTime: queryOptions?.cacheTime,
    ...queryOptions,
  });
};
