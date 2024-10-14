import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getMintToken } from '../utils/getMintToken';
import type {
  GetMintTokenResponse,
  UseMintToken,
  UseQueryOptions,
} from '../types';

export function useMintToken(
  { mintAddress, takerAddress, network, quantity, tokenId }: UseMintToken,
  queryOptions?: UseQueryOptions,
): UseQueryResult<GetMintTokenResponse> {
  const { enabled = true, cacheTime } = queryOptions ?? {};
  const actionKey = `useMintToken-${mintAddress}-${takerAddress}-${tokenId}-${quantity}`;
  return useQuery({
    queryKey: ['useMintToken', actionKey],
    queryFn: async () => {
      return getMintToken({
        mintAddress,
        takerAddress,
        network,
        quantity,
        tokenId,
      });
    },
    gcTime: cacheTime,
    enabled:
      enabled &&
      Boolean(mintAddress && takerAddress && quantity) &&
      network !== undefined,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
  });
}
