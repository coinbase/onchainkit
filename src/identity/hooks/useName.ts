import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';
import { GetNameReturnType } from '../types';
import { getName } from '../core/getName';

type UseNameOptions = {
  address: Address;
};

type UseNameQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @param {UseNameOptions} arguments
 * @param {Address} arguments.address - The Ethereum address for which the ENS name is to be fetched.
 * @param {UseNameQueryOptions} queryOptions - Additional query options, including `enabled` and `cacheTime`
 * @param {boolean} queryOptions.enabled - Whether the query should be enabled. Defaults to true.
 * @param {number} queryOptions.cacheTime - Cache time in milliseconds.
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
export const useName = ({ address }: UseNameOptions, queryOptions?: UseNameQueryOptions) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const ensActionKey = `ens-name-${address}`;
  return useQuery<GetNameReturnType>({
    queryKey: ['useName', ensActionKey],
    queryFn: async () => {
      return await getName(address);
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
