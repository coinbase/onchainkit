import { useMemo } from 'react';
import { useChainId } from 'wagmi';
import { useMetadata } from './useMetadata';
import { useTokenDetails } from './useTokenDetails';
import type { NftData } from '../types';

export function useNftData(contractAddress: `0x${string}`, tokenId: string):NftData {
  const chainId = useChainId();

  const { data: tokenDetails } = useTokenDetails({
    contractAddress,
    tokenId,
    chainId,
  });

  // Any way to get LastSalePrice from onchain data without having to support each different exchange?
  // that would allow all view data to come from onchain data
  const { data: metadata } = useMetadata({ contractAddress, tokenId });
  console.log('metadata', metadata);

  return useMemo(() => ({
    contractAddress,
    tokenId,
    // name: metadata?.name,
    // description: metadata?.description,
    // image: metadata?.image,
    // ownerAddress: owner as `0x${string}`,
    name: tokenDetails?.name,
    description: tokenDetails?.description,
    imageUrl:
      tokenDetails?.imageUrl || tokenDetails?.cachedImageUrl?.originalUrl,
    animationUrl:
      tokenDetails?.animationUrl ||
      tokenDetails?.cachedAnimationUrl?.originalUrl,
    mimeType:
      tokenDetails?.cachedAnimationUrl?.mimeType ||
      tokenDetails?.cachedImageUrl?.mimeType,
    ownerAddress: tokenDetails?.ownerAddress as `0x${string}`,
    lastSoldPrice: {
      price: tokenDetails?.lastSoldPrice,
      currency: tokenDetails?.paymentCurrency,
    },
    contractType: tokenDetails?.tokenType,
  }), [tokenDetails, contractAddress, tokenId]);
}
