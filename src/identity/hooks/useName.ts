import { useQuery } from '@tanstack/react-query';
import type {
  GetNameReturnType,
  UseNameOptions,
  UseNameQueryOptions,
} from '../types';
import { getName } from '../utils/getName';

/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
export const useName = (
  { address, chain }: UseNameOptions,
  queryOptions?: UseNameQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const chainActionKey = chain ? chain.id : 'default-chain';
  const ensActionKey = `ens-name-${address}-${chainActionKey}`;
  return useQuery<GetNameReturnType>({
    queryKey: ['useName', ensActionKey],
    queryFn: async () => {
      return await getName({ address, chain });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
