import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type {
  GetMintDetailsParams,
  GetMintDetailsResponse,
} from '../../api/types';
import { getMintDetails } from '../../api/getMintDetails';

export function useMintDetails({
  contractAddress,
  takerAddress,
  tokenId,
}: GetMintDetailsParams): UseQueryResult<GetMintDetailsResponse> {
  const actionKey = `useMintDetails-${contractAddress}-${takerAddress}-${tokenId}`;
  return useQuery({
    queryKey: ['useMintDetails', actionKey],
    queryFn: async () =>
      getMintDetails({
        contractAddress,
        takerAddress,
        tokenId,
      }),
    enabled: true,
    refetchOnWindowFocus: false,
  });
}
