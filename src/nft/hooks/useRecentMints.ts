import { mainnet } from 'viem/chains';
import type {
  GetRecentMintsReturnType,
  UseQueryOptions,
  UseRecentMintsOptions,
} from '../types';
import { useQuery } from '@tanstack/react-query';
import { getRecent721Mints } from '../utils/getRecent721Mints';
import { getRecent1155Mints } from '../utils/getRecent1155Mints';

export const useRecentMints = (
  {
    contractAddress,
    count = 2,
    chain = mainnet,
    tokenType,
  }: UseRecentMintsOptions,
  queryOptions?: UseQueryOptions,
) => {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useRecentMints-${contractAddress}-${count}-${chain.id}`;
  return useQuery<GetRecentMintsReturnType>({
    queryKey: ['useRecentMints', actionKey],
    queryFn: async () => {
      if (tokenType === 'ERC1155') {
        return await getRecent1155Mints({ contractAddress, count, chain });
      }
      return await getRecent721Mints({ contractAddress, count, chain });
    },
    gcTime: cacheTime,
    enabled: enabled && Boolean(contractAddress),
    refetchOnWindowFocus: false,
  });
};
