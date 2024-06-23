import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { getName } from '../core/getName';
import type { GetNameReturnType } from '../types';

type UseNameOptions = {
  address: Address; // The Ethereum address for which the ENS name is to be fetched.
};

// Additional query options, including `enabled` and `cacheTime`
type UseNameQueryOptions = {
  enabled?: boolean; // Whether the query should be enabled. Defaults to true.
  cacheTime?: number; // Cache time in milliseconds.
};

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
export const useName = (
  { address }: UseNameOptions,
  queryOptions?: UseNameQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-name-${address}`;
  return useQuery<GetNameReturnType>({
    queryKey: ['useName', ensActionKey],
    queryFn: async () => {
      return await getName({ address });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
