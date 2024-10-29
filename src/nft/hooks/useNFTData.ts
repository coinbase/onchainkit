import { useMemo } from 'react';
import type { ContractType, NFTData, NFTError } from '../types';
import { useTokenDetails } from './useTokenDetails';
import { isNFTError } from '../utils/isNFTError';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider';

export function useNFTData(
  contractAddress: `0x${string}`,
  tokenId?: string,
): NFTData | NFTError {
  const { updateLifecycleStatus } = useNFTLifecycleContext();

  const { data: tokenDetails } = useTokenDetails({
    contractAddress,
    tokenId: tokenId,
  });

  if (isNFTError(tokenDetails)) {
    updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: tokenDetails.code,
        error: tokenDetails.error,
        message: tokenDetails.message,
      },
    });
    return tokenDetails;
  }

  return useMemo(
    () => ({
      contractAddress,
      tokenId,
      name: tokenDetails?.name,
      description: tokenDetails?.description,
      imageUrl: tokenDetails?.imageUrl,
      animationUrl: tokenDetails?.animationUrl,
      mimeType: tokenDetails?.mimeType,
      ownerAddress: tokenDetails?.ownerAddress as `0x${string}`,
      lastSoldPrice: tokenDetails?.lastSoldPrice,
      contractType: tokenDetails?.contractType as ContractType,
    }),
    [contractAddress, tokenDetails, tokenId],
  );
}
