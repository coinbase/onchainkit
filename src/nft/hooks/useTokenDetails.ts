import { getTokenDetails } from '@/api/getTokenDetails';
import type { TokenDetails } from '@/api/types';
import { isNFTError } from '@/nft/utils/isNFTError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { UseTokenDetailsParams } from '../types';

export function useTokenDetails({
  contractAddress,
  tokenId,
  queryOptions,
}: UseTokenDetailsParams<TokenDetails>): UseQueryResult<TokenDetails> {
  return useQuery({
    queryKey: ['useTokenDetails', contractAddress, tokenId],
    queryFn: async () => {
      const tokenDetails = await getTokenDetails({
        contractAddress,
        tokenId,
      });

      if (isNFTError(tokenDetails)) {
        throw tokenDetails;
      }

      return tokenDetails;
    },
    retry: false,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
}
