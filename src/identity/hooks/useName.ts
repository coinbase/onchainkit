import { getName } from '@/identity/utils/getName';
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
  const { enabled = true, cacheTime } = queryOptions ?? {};
  return useQuery<GetNameReturnType>({
    queryKey: ['useName', address, chain.id],
    queryFn: async () => {
      return await getName({ address, chain });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
