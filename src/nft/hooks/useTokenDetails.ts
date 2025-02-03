import { getTokenDetails } from '@/api/getTokenDetails';
import type { TokenDetails } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { isNFTError } from '@/nft/utils/isNFTError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { UseTokenDetailsParams } from '../types';

export function useTokenDetails(
  params: UseTokenDetailsParams<TokenDetails>,
  _context: RequestContext = RequestContext.Hook,
): UseQueryResult<TokenDetails> {
  const { contractAddress, tokenId, queryOptions } = params;

  return useQuery({
    queryKey: ['useTokenDetails', contractAddress, tokenId],
    queryFn: async () => {
      const tokenDetails = await getTokenDetails(
        {
          contractAddress,
          tokenId,
        },
        _context,
      );

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
