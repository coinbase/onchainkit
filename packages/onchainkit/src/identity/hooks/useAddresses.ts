import { getAddresses } from '@/identity/utils/getAddresses';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetAddressReturnType,
  UseAddressesOptions,
  UseQueryOptions,
} from '../types';

/**
 * A React hook that leverages the `@tanstack/react-query` for fetching and optionally caching
 * multiple Ethereum addresses from ENS names or Basenames in a single batch request.
 */
export const useAddresses = (
  { names, chain = mainnet }: UseAddressesOptions,
  queryOptions?: UseQueryOptions<GetAddressReturnType[]>,
) => {
  const namesKey = names.join(',');
  const queryKey = ['useAddresses', namesKey, chain.id];

  return useQuery<GetAddressReturnType[]>({
    queryKey,
    queryFn: () => getAddresses({ names, chain }),
    enabled: !!names.length,
    ...DEFAULT_QUERY_OPTIONS,
    // Use cacheTime as gcTime for backward compatibility
    gcTime: queryOptions?.cacheTime,
    ...queryOptions,
  });
};
