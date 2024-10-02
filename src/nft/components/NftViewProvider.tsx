import { useContext, createContext } from 'react';
import type { NftViewProviderReact, NftViewContextType } from '../types';
import { useValue } from '../../internal/hooks/useValue';
import { useTokenDetails } from '../hooks/useTokenDetails';
import { useChainId } from 'wagmi';
import { useMetadata } from '../hooks/useMetadata';

const emptyContext = {} as NftViewContextType;

export const NftViewContext = createContext<NftViewContextType>(emptyContext);

export function useNftViewContext() {
  const context = useContext(NftViewContext);
  if (context === emptyContext) {
    throw new Error(
      'useNftViewContext must be used within a NftView component',
    );
  }
  return context;
}

export function NftViewProvider({
  children,
  contractAddress,
  tokenId,
}: NftViewProviderReact) {
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

  const value = useValue({
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
  });

  return (
    <NftViewContext.Provider value={value}>{children}</NftViewContext.Provider>
  );
}
