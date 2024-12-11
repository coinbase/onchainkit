import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTokenDetails } from '../../../core/api/getTokenDetails';
import type {
  GetTokenDetailsParams,
  TokenDetails,
} from '../../../core/api/types';
import { isNFTError } from '../../../core/nft/utils/isNFTError';

export function useTokenDetails({
  contractAddress,
  tokenId,
}: GetTokenDetailsParams): UseQueryResult<TokenDetails> {
  const actionKey = `useTokenDetails-${contractAddress}-${tokenId}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
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
  });
}
