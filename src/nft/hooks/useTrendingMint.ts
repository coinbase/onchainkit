import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type {
  GetTrendingMintCollectionResponse,
  UseQueryOptions,
  UseTrendingMintOptions,
} from '../types';
import { getTrendingMint } from '../utils/getTrendingMint';

export function useTrendingMint(
  { address, takerAddress, network }: UseTrendingMintOptions,
  queryOptions?: UseQueryOptions,
): UseQueryResult<GetTrendingMintCollectionResponse> {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useTrendingMint-${address}-${takerAddress}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
    queryFn: async () => {
      return getTrendingMint(address, takerAddress, network);
    },
    gcTime: cacheTime,
    enabled: enabled && Boolean(address && takerAddress),
    refetchOnWindowFocus: false,
  });
}
