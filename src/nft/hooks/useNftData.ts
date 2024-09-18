import { useAccount } from "wagmi";
import { useTokenDetails } from "./useTokenDetails";
import { useTrendingMint } from "./useTrendingMint";
import { base } from 'viem/chains';
import { useMemo } from "react";
import type { NftData } from "../types";

type UseNftData = {
  contractAddress: string;
  tokenId?: number;
  isMint?: boolean;
};

export function useNftData({contractAddress, tokenId, isMint = false}: UseNftData) {
  const { address } = useAccount();

  // if not connected, prompt to connect???
  
  // get base token details
  const { data } = useTokenDetails({ contractAddress, tokenId: tokenId ? tokenId.toString() : undefined, chain: base });
  console.log('stuff', data);
  
  
  const { data: trendingMint } = useTrendingMint({ address: contractAddress, takerAddress: address}, { enabled: isMint });
  console.log('trendingMint', trendingMint);

  const tokenData = useMemo(() => {
    if (!data) {
      return undefined;
    }

    const nowInSeconds = new Date().getTime() / 1000;
    const currentStage = trendingMint?.collection?.stages?.find(
      (stage) =>
        stage.tokenId === tokenId ||
        (typeof stage.endTime === 'undefined' && stage.stage === 'public-sale') ||
        (stage.endTime && Number(stage.endTime) > nowInSeconds && stage.stage === 'public-sale'),
    );
     

    return {
      collection: {
        creator: data.contractAddress,
        name: data.collectionName
      },
      lastSalePrice: {
        value: data.lastSoldPrice,
        currency: data.paymentCurrency,
      },
      owner: data.ownerAddress,
      name: data.name,
      description: data.description,
      image: data.imageUrl,
      media: data.animationUrl,
      mimeType: data.cachedAnimationUrl?.mimeType ?? data.cachedImageUrl?.mimeType,
      price: currentStage?.price,
      maxQuantity: currentStage?.maxMintsPerWallet ? Number(currentStage.maxMintsPerWallet) : undefined,
    } as NftData;
  }, [data, trendingMint, tokenId]);

  return tokenData;
}

/*
      const nowInSeconds = new Date().getTime() / 1000;
      const currentStage = trendingMint.collection?.stages?.find(
        (stage) =>
          stage.tokenId === tokenId ||
          (typeof stage.endTime === 'undefined' && stage.stage === 'public-sale') ||
          (stage.endTime && Number(stage.endTime) > nowInSeconds && stage.stage === 'public-sale'),
      );
      metadata.price = currentStage?.price;

*/