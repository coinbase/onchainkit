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
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
export const useName = (
  { address, chain = mainnet }: UseNameOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled, cacheTime, staleTime, refetchOnWindowFocus } = {
    ...DEFAULT_QUERY_OPTIONS,
    ...queryOptions,
  };

  const queryKey = ['useName', address, chain.id];

  return useQuery<GetNameReturnType>({
    queryKey,
    queryFn: async () => {
      console.log(
        `[useName] Cache MISS - Fetching name for address: ${address} on chain: ${chain.id}`,
      );
      const result = await getName({ address, chain });
      console.log(`[useName] Fetch completed with result:`, result);
      return result;
    },
    gcTime: cacheTime,
    staleTime: staleTime,
    enabled,
    refetchOnWindowFocus,
    select: (data: GetNameReturnType) => {
      console.log(`[useName] Query SUCCESS - Data loaded`);
      return data;
    },
  });
};
