import type {
  GetAddressReturnType,
  UseAddressOptions,
  UseQueryOptions,
} from '@/identity/types';
import { getAddress } from '@/identity/utils/getAddress';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';

export const useAddress = (
  { name, chain = mainnet }: UseAddressOptions,
  queryOptions?: UseQueryOptions<GetAddressReturnType>,
) => {
  const queryKey = ['useAddress', name, chain.id];

  return useQuery<GetAddressReturnType>({
    queryKey,
    queryFn: () => getAddress({ name, chain }),
    enabled: !!name,
    ...DEFAULT_QUERY_OPTIONS,
    // Use cacheTime as gcTime for backward compatibility
    gcTime: queryOptions?.cacheTime,
    ...queryOptions,
  });
};
