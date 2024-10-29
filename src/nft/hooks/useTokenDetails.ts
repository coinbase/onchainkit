import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getTokenDetails } from '../../api/getTokenDetails';
import type {
  GetTokenDetailsParams,
  GetTokenDetailsResponse,
} from '../../api/types';

export function useTokenDetails({
  contractAddress,
  tokenId,
}: GetTokenDetailsParams): UseQueryResult<GetTokenDetailsResponse> {
  const actionKey = `useTokenDetails-${contractAddress}-${tokenId}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
    queryFn: async () =>
      getTokenDetails({
        contractAddress,
        tokenId,
      }),
    enabled: true,
    refetchOnWindowFocus: false,
  });
}
