import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type {
  Collectible,
  UseQueryOptions,
  UseTokenDetailsOptions,
} from '../types';
import { getTokenDetails } from '../utils/getTokenDetails';

export function useTokenDetails(
  {
    contractAddress,
    tokenId,
    userAddress,
    chainId,
    includeFloorPrice,
  }: UseTokenDetailsOptions,
  queryOptions?: UseQueryOptions,
): UseQueryResult<Collectible> {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useTokenDetails-${contractAddress}-${tokenId}-${chainId}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
    queryFn: async () => {
      return getTokenDetails({
        contractAddress,
        tokenId,
        includeFloorPrice,
        chainId,
        userAddress,
      });
    },
    gcTime: cacheTime,
    enabled,
    refetchOnWindowFocus: false,
  });
}
