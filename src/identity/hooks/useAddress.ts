import type {
  GetAddressReturnType,
  UseAddressOptions,
  UseQueryOptions,
} from '@/identity/types';
import { getAddress } from '@/identity/utils/getAddress';
import { useQuery } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';

export const useAddress = (
  { name, chain = mainnet }: UseAddressOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useAddress-${name}-${chain.id}`;
  return useQuery<GetAddressReturnType>({
    queryKey: ['useAddress', actionKey],
    queryFn: async () => {
      return await getAddress({ name, chain });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
};
