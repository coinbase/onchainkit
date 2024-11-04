import { useQuery } from '@tanstack/react-query';
import { getTokenDetails } from '../../api/getTokenDetails.js';
import { isNFTError } from '../utils/isNFTError.js';
function useTokenDetails({
  contractAddress,
  tokenId
}) {
  const actionKey = `useTokenDetails-${contractAddress}-${tokenId}`;
  return useQuery({
    queryKey: ['useTokenDetails', actionKey],
    queryFn: async () => {
      const tokenDetails = await getTokenDetails({
        contractAddress,
        tokenId
      });
      if (isNFTError(tokenDetails)) {
        throw tokenDetails;
      }
      return tokenDetails;
    },
    retry: false,
    refetchOnWindowFocus: false
  });
}
export { useTokenDetails };
//# sourceMappingURL=useTokenDetails.js.map
