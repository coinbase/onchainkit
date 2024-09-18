import { useContext, createContext, useMemo } from 'react';
import type { NftProviderReact, NftContextType, NftData } from '../types';
import { useValue } from '../../internal/hooks/useValue';
import { useTokens } from '../hooks/useTokens';
import { base } from 'viem/chains';
import { useTokenDetails } from '../hooks/useTokenDetails';
import { useTrendingMint } from '../hooks/useTrendingMint';
import { useAccount } from 'wagmi';
import { useNftData } from '../hooks/useNftData';
import { useMintToken } from '../hooks/useMintToken';

const emptyContext = {} as NftContextType;

export const NftContext = createContext<NftContextType>(emptyContext);

export function useNftContext() {
  const context = useContext(NftContext);
  if (context === emptyContext) {
    throw new Error('useSwapContext must be used within a Swap component');
  }
  return context;
}

export function NftProvider({
  children,
  contractAddress,
  tokenId,
  isMint = false
}: NftProviderReact) {
//   const {data: reservoirData} = useTokens({ tokens: [`${contractAddress}:${tokenId ?? 1}`], chain: base });
// console.log('reservoir', reservoirData);

const tokenData = useNftData({contractAddress, tokenId, isMint});

const { address } = useAccount();

const mintContract = useMintToken({mintAddress: contractAddress, takerAddress: address?.toString() ?? '', tokenId: `${tokenId}`});

console.log('mintContract', mintContract);

/*

  wire everything up to wallet api's


https://api.wallet.coinbase.com/rpc/v3/creators/mintToken
Request Method:
POST
bypassSimulation:true
mintAddress:"0x5C5C97713309278baC0c2653fD0C3423681dB825"
network:"networks/base-mainnet"
quantity:"1"
takerAddress:"0xbB68Fc6d7469899dC8eb79Ad2895B16Ec36dF5Fe"
*/



  /*
    {
    data?.collection?.creator
    data?.lastSale?.price
    data?.owner
    data?.name
    data?.description

    data?.image
    data?.media
    data?.metadata?.mediaMimeType
    }

  */


  const value = useValue({
    contractAddress,
    tokenId,
    data: tokenData,
    mintData: mintContract.data
  });

  return <NftContext.Provider value={value}>{children}</NftContext.Provider>;
}

/*

  if (
    trendingMint?.collection?.kind === 'ContractKindERC721' ||
    tokenId === 'undefined' ||
    tokenId === undefined
  ) {
    metadata.name = trendingMint?.collection?.name ?? tokenDetails?.collectionName;
    metadata.description =
      trendingMint?.collection?.description ??
      tokenDetails?.description ??
      tokenDetails?.collectionDescription;

    // For ERC-721 tokens, use the cachedCollectionImg to retrieve the generic
    // image for the entire collection
    metadata.image = await getCachedMediaUrl({
      cachePath:
        tokenDetails?.cachedCollectionImg?.cachedPath ||
        tokenDetails?.cachedImageUrl?.cachedPath ||
        tokenDetails?.cachedAnimationUrl?.cachedPath,
      mimeType:
        tokenDetails?.cachedCollectionImg?.mimeType ||
        tokenDetails?.cachedImageUrl?.mimeType ||
        tokenDetails?.cachedAnimationUrl?.mimeType,
      preview: false,
    });
    metadata.imagePreview = await getCachedMediaUrl({
      cachePath:
        tokenDetails?.cachedCollectionImg?.cachedPath ||
        tokenDetails?.cachedImageUrl?.cachedPath ||
        tokenDetails?.cachedAnimationUrl?.cachedPath,
      mimeType:
        tokenDetails?.cachedCollectionImg?.mimeType ||
        tokenDetails?.cachedImageUrl?.mimeType ||
        tokenDetails?.cachedAnimationUrl?.mimeType,
      preview: true,
    });
  } else {
    metadata.name =
      trendingMint?.collection?.tokenDetails?.name ??
      tokenDetails?.name ??
      trendingMint?.collection?.name;
    metadata.description =
      trendingMint?.collection?.tokenDetails?.description ??
      tokenDetails?.description ??
      trendingMint?.collection?.description;

    // For ERC-1155 tokens, we don't want to look at collection image because individual tokens
    // likely have their own artwork
    metadata.image = await getCachedMediaUrl({
      cachePath:
        tokenDetails?.cachedImageUrl?.cachedPath || tokenDetails?.cachedAnimationUrl?.cachedPath,
      mimeType:
        tokenDetails?.cachedImageUrl?.mimeType || tokenDetails?.cachedAnimationUrl?.mimeType,
      preview: false,
    });
    metadata.imagePreview = await getCachedMediaUrl({
      cachePath:
        tokenDetails?.cachedImageUrl?.cachedPath || tokenDetails?.cachedAnimationUrl?.cachedPath,
      mimeType:
        tokenDetails?.cachedImageUrl?.mimeType || tokenDetails?.cachedAnimationUrl?.mimeType,
      preview: true,
    });
  }
*/