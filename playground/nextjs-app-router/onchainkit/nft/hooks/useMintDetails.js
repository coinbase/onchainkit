import { useQuery } from '@tanstack/react-query';
import { getMintDetails } from '../../api/getMintDetails.js';
import { isNFTError } from '../utils/isNFTError.js';
function useMintDetails({
  contractAddress,
  takerAddress,
  tokenId
}) {
  const actionKey = `useMintDetails-${contractAddress}-${takerAddress}-${tokenId}`;
  return useQuery({
    queryKey: ['useMintDetails', actionKey],
    queryFn: async () => {
      const mintDetails = await getMintDetails({
        contractAddress,
        takerAddress,
        tokenId
      });
      if (isNFTError(mintDetails)) {
        throw mintDetails;
      }
      return mintDetails;
    },
    retry: false,
    refetchOnWindowFocus: false
  });
}
export { useMintDetails };
//# sourceMappingURL=useMintDetails.js.map
