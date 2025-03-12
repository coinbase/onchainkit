import { getAddress } from '@/identity/utils/getAddress';
import { DEFAULT_QUERY_OPTIONS } from '@/internal/constants';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import type {
  GetAddressReturnType,
  UseAddressOptions,
  UseQueryOptions,
} from '../types';

export const useAddress = (
  { name, chain = mainnet }: UseAddressOptions,
  queryOptions?: UseQueryOptions<GetAddressReturnType>,
) => {
  const { enabled, cacheTime, staleTime, refetchOnWindowFocus } = {
    ...DEFAULT_QUERY_OPTIONS,
    ...queryOptions,
  };

  return useQuery<GetAddressReturnType>({
    queryKey: ['useAddress', name, chain.id],
    queryFn: () => getAddress({ name, chain }),
    gcTime: cacheTime,
    staleTime,
    enabled: enabled && !!name,
    refetchOnWindowFocus,
  });
};
