import { getMintDetails } from '@/api/getMintDetails';
import type { MintDetails } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { isNFTError } from '@/nft/utils/isNFTError';
import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import type { UseMintDetailsParams } from '../types';

export function useMintDetails(
  params: UseMintDetailsParams<MintDetails>,
  _context: RequestContext = RequestContext.Hook,
): UseQueryResult<MintDetails> {
  const { contractAddress, takerAddress, tokenId, queryOptions } = params;

  return useQuery({
    queryKey: ['useMintDetails', contractAddress, takerAddress, tokenId],
    queryFn: async () => {
      const mintDetails = await getMintDetails(
        {
          contractAddress,
          takerAddress,
          tokenId,
        },
        _context,
      );

      if (isNFTError(mintDetails)) {
        throw mintDetails;
      }

      return mintDetails;
    },
    retry: false,
    refetchOnWindowFocus: false,
    ...queryOptions,
  });
}
