import type { ReactNode } from "react";
import type { paths } from '@reservoir0x/reservoir-sdk'
import type { Price } from "./hooks/useTrendingMint";
import { GetMintTokenResponse } from "./hooks/useMintToken";

type NonNullable<T> = T & {};

export type NftDataType = NonNullable<paths['/tokens/v7']['get']['responses']['200']['schema']['tokens']>[0]['token'];

export type NftData = {
  collection: {
    creator: string;
    name: string;
  };
  lastSalePrice: {
    value: string;
    currency: string;
  };
  owner: string;
  name: string;
  description: string;
  image: string;
  media: string;
  mimeType: string;
  price: Price;
  maxQuantity?: number;
};

export type NftContextType = {
  contractAddress: `0x${string}`;
  tokenId?: number;
  data?: NftData;
  mintData?: GetMintTokenResponse;
};

/*
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
      //media: stuff?.media,
      mimeType: data.cachedImageUrl?.mimeType,

*/

export type NftProviderReact = {
  children: React.ReactNode;
  contractAddress: `0x${string}`;
  tokenId?: number;
  isMint?: boolean;
};

/**
 * Note: exported as public Type
 */
export type NftReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  contractAddress: `0x${string}`; // Contract address of the NFT
  tokenId: number, // Token ID of the NFT
};

export type NftMintReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  contractAddress: `0x${string}`; // Contract address of the NFT
  tokenId?: number; // Token ID of the NFT
};
