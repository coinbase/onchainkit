import { getTokenDetails } from '@/core/api/getTokenDetails';
import type { TokenDetails } from '@/core/api/types';
import { isNFTError } from '@/core/nft/utils/isNFTError';
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
