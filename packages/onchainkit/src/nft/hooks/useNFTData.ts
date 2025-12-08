import type { ContractType, NFTError } from '@/api/types';
import { RequestContext } from '@/core/network/constants';
import { convertIpfsToHttps } from '@/nft/utils/ipfs';
import { useEffect, useState } from 'react';
import { useNFTLifecycleContext } from '../components/NFTLifecycleProvider';
import type { NFTData } from '../types';
import { useTokenDetails } from './useTokenDetails';

export function useNFTData(
  contractAddress: `0x${string}`,
  tokenId?: string,
): NFTData | NFTError {
  const { updateLifecycleStatus } = useNFTLifecycleContext();
  const [error, setError] = useState<NFTError | null>(null);

  useEffect(() => {
    if (error) {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: error,
      });
    }
  }, [error, updateLifecycleStatus]);

  const { error: tokenError, data: tokenDetails } = useTokenDetails(
    {
      contractAddress,
      tokenId: tokenId,
    },
    RequestContext.NFT,
  );

  if (tokenError && !error) {
    setError({
      code: 'NmND01',
      message: tokenError.message,
      error: 'Error fetching NFT data',
    });
    return tokenError;
  }

  return {
    name: tokenDetails?.name,
    description: tokenDetails?.description,
    imageUrl: convertIpfsToHttps(tokenDetails?.imageUrl),
    animationUrl: convertIpfsToHttps(tokenDetails?.animationUrl),
    mimeType: tokenDetails?.mimeType,
    ownerAddress: tokenDetails?.ownerAddress as `0x${string}`,
    lastSoldPrice: tokenDetails?.lastSoldPrice,
    contractType: tokenDetails?.contractType as ContractType,
  };
}
