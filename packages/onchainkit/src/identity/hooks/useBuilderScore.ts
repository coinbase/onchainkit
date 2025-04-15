import { getBuilderScore } from '../../api/getBuilderScore';
import { DEFAULT_QUERY_OPTIONS } from '../../internal/constants';
import { useQuery } from '@tanstack/react-query';
import type {
  BuilderScore,
  UseBuilderScoreOptions,
  UseQueryOptions,
} from '../types';

/**
 * A React hook that leverages the `@tanstack/react-query` for fetching and caching
 * builder scores from the Talent Protocol smart contract on Base.
 *
 * @returns An object containing:
 *  - `data`: The fetched builder score for the provided address
 *  - Standard React Query return values including isLoading, isError, error, etc.
 */
export const useBuilderScore = (
  { address }: UseBuilderScoreOptions,
  queryOptions?: UseQueryOptions<BuilderScore>,
) => {
  const queryKey = ['useBuilderScore', address];

  return useQuery<BuilderScore>({
    queryKey,
    queryFn: () => {
      if (!address) {
        throw new Error('Address is required');
      }
      return getBuilderScore(address);
    },
    enabled: !!address,
    ...DEFAULT_QUERY_OPTIONS,
    // Use cacheTime as gcTime for backward compatibility
    gcTime: queryOptions?.cacheTime,
    ...queryOptions,
  });
};
