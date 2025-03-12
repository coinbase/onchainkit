import { getName } from '@/identity/utils/getName';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetNameReturnType,
  UseNameOptions,
  UseQueryOptions,
} from '../types';

/**
 * A React hook that leverages the `@tanstack/react-query` for fetching and optionally caching
 * a Basename or ENS name.
 */
export const useName = (
  { address, chain = mainnet }: UseNameOptions,
  queryOptions?: UseQueryOptions<GetNameReturnType>,
) => {
  const queryKey = ['useName', address, chain.id];

  return useQuery<GetNameReturnType>({
    queryKey,
    queryFn: () => getName({ address, chain }),
    ...DEFAULT_QUERY_OPTIONS,
    ...queryOptions,
    enabled:
      queryOptions?.enabled !== undefined
        ? queryOptions.enabled && !!address
        : DEFAULT_QUERY_OPTIONS.enabled && !!address,
  });
};
