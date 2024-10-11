import type { ReactNode } from 'react';
import type { Address, Chain, TransactionReceipt } from 'viem';
import type { TransactionError } from '../transaction/types';

type CachedMediaType = {
  originalUrl?: string;
  cachedPath?: string;
  mimeType?: string;
  itemSizeBytes?: string;
};

type RecentCollectibleMedia = {
  image?: CachedMediaType;
  animation?: CachedMediaType;
};

type CollectibleAttribute = {
  attributeName: string | undefined;
  attributeValue: string | undefined;
};

type AudioMetadata = {
  artistName?: string;
  songName?: string;
};

type PendingCollectibleDetails = {
  contractAddress: string;
  name?: string;
  tokenType?: string;
  tokenId: string;
  media?: RecentCollectibleMedia;
  description?: string;
  blockchainExplorerUrl?: CollectibleLink;
  marketplaceUrls?: CollectibleLink[];
  collectionName?: string;
  ownerAddress?: string;
  chainId?: string;
};

type CollectibleLink = {
  iconUrl?: string;
  name: string;
  url: string;
};

export type Collectible = {
  contractAddress: string;
  collectionName: string;
  collectionSymbol: string;
  tokenId: string;
  tokenType: string;
  name?: string;
  description?: string;
  externalUrl?: string;
  imageUrl?: string;
  cachedImageUrl?: CachedMediaType;
  animationUrl?: string;
  cachedAnimationUrl?: CachedMediaType;
  youtubeUrl?: string;
  iframeUrl?: string;
  attributes?: CollectibleAttribute[];
  openseaLink?: string;
  raribleLink?: string;
  coinbaseLink?: string;
  paymentCurrency: string;
  lastSoldPrice?: string;
  tokenCount: string;
  ownerCount: string;
  floorPrice?: string;
  estimatedTokenValue?: string;
  ownerAddress?: string;
  spam?: boolean;
  audioNftMetadata?: AudioMetadata;
  ownedByWallet?: boolean;
  isPending?: boolean;
  pendingTokenDetails?: PendingCollectibleDetails;
  hasUnretrievableMetadata?: boolean;
  blockchainExplorerUrl?: CollectibleLink;
  marketplaceUrls?: CollectibleLink[];
};

export type UseTokenDetailsOptions = {
  contractAddress: string;
  tokenId?: string;
  chainId: number;
  includeFloorPrice?: boolean;
  userAddress?: string;
};

export type GetTokenDetailsParams = {
  contractAddress?: string;
  tokenId?: string;
  includeFloorPrice: string;
  chainId?: string;
  userAddress?: string;
};

export type UseQueryOptions = {
  enabled?: boolean;
  cacheTime?: number;
};

enum ContractKind {
  CONTRACTKINDERC721 = 'ContractKindERC721',
  CONTRACTKINDERC1155 = 'ContractKindERC1155',
}

type Amount = {
  decimal?: number;
  native?: number;
  raw?: string;
  usd?: number;
};

type Currency = {
  contract?: string;
  decimals?: string;
  name?: string;
  symbol?: string;
};

type Price = {
  amount?: Amount;
  currency?: Currency;
};

type PricePerQuantity = {
  price?: Price;
  quantity?: string;
};

type MintTokenDetails = {
  description?: string;
  name?: string;
  tokenId?: string;
};

type MintStage = {
  endTime?: string;
  kind?: string;
  maxMintsPerWallet?: string;
  price?: Price;
  pricePerQuantity?: PricePerQuantity[];
  stage?: string;
  standard?: string;
  startTime?: string;
  tokenId?: string;
};

export type MintCollection = {
  address?: string;
  animationUrl?: string;
  creatorAddress?: string;
  description?: string;
  galleryId?: string;
  imageUrl?: string;
  isMinting?: boolean;
  kind?: ContractKind;
  maxSupply?: string;
  mintCount?: string;
  name?: string;
  network?: string;
  stages?: MintStage[];
  tokenDetails?: MintTokenDetails;
  tokenforgeMint?: boolean;
  tokenforgeMintActive?: boolean;
  tokenforgeMintExists?: boolean;
};

type TakerEligibility = {
  address?: string;
  eligibleForCollection?: boolean;
  eligibleForTokens?: string[];
};

export type UseTrendingMintOptions = {
  address: string;
  takerAddress?: string;
  network?: string;
};

export type GetTrendingMintCollectionResponse = {
  collection?: MintCollection;
  mintFee?: Amount;
  takerEligibility?: TakerEligibility;
};

export type UseMintToken = {
  mintAddress: `0x${string}`;
  takerAddress?: `0x${string}`;
  network?: string;
  quantity: string;
  tokenId?: string;
};

export type GetMintTokenResponse = {
  callData?: {
    data: `0x${string}`;
    from: `0x${string}`;
    to: `0x${string}`;
    value: string;
  };
  error?: {
    code: number;
    message: string;
  };
};

export type GetMintToken = {
  mintAddress: string;
  takerAddress?: string;
  network?: string;
  quantity: string;
  tokenId?: string;
};

export type MintTokenParams = {
  bypassSimulation: boolean;
  loadTest: boolean;
  mintAddress: string;
  network: string;
  quantity: string;
  takerAddress: string;
  tokenId?: string;
};

export type UseRecentMintsOptions = {
  contractAddress: `0x${string}`;
  count?: number;
  chain?: Chain;
  tokenType?: string;
};

export type GetRecentMintsReturnType = MintEvent[] | null;

export type GetRecentMints = {
  contractAddress: `0x${string}`;
  count: number;
  chain?: Chain;
};

export type MintEvent = {
  to: `0x${string}`;
  tokenId: bigint;
  blockNumber: bigint;
  transactionHash: `0x${string}`;
  address: `0x${string}`;
  blockHash: `0x${string}` | null;
  data: `0x${string}`;
  logIndex: number | null;
  removed: boolean;
  transactionIndex: number | null;
};

export enum ContractType {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}

/* Move all types above here to data layer types */

/* Lifecycle Provider */

export enum LifecycleType {
  VIEW = 'view',
  MINT = 'mint',
}

export type NftLifecycleProviderReact = {
  type: LifecycleType;
  onError?: (error: NftError) => void;
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
  children: ReactNode;
};

export type NftLifecycleContextType = {
  type: LifecycleType;
  lifecycleStatus: LifecycleStatus;
  updateLifecycleStatus: (status: LifecycleStatusUpdate) => void;
};

/* Nft Provider */

/**
 * Note: exported as public Type
 */
export type NftData = {
  name?: string;
  description?: string;
  imageUrl?: string;
  animationUrl?: string;
  mimeType?: string;
  ownerAddress?: `0x${string}`;
  lastSoldPrice: {
    price?: string;
    currency?: string;
  };
  contractType?: string;
};

export type NftContextType = {
  contractAddress: `0x${string}`;
  tokenId?: string;
} & NftData;

export type NftProviderReact = {
  children: ReactNode;
  contractAddress: `0x${string}`;
  tokenId: string;
  useNftData?: UseNftData;
};

/* Mint Provider */

export type MintPrice = {
  amount?: number;
  currency?: string;
};

/**
 * Note: exported as public Type
 */
export type NftMintData = {
  price?: MintPrice;
  creatorAddress?: `0x${string}`;
  maxMintsPerWallet?: string;
  isEligibleToMint?: boolean;
  totalOwners?: number;
  callData?: {
    data: `0x${string}`;
    from: `0x${string}`;
    to: `0x${string}`;
    value: string;
  };
  mintError?: {
    code: number;
    message: string;
  };
};

export type NftMintContextType = {
  quantity: number;
  setQuantity: (quantity: string) => void;
} & NftMintData;

export type NftMintProviderReact = {
  useNftMintData?: UseNftMintData;
  children: ReactNode;
};

type UseNftData = (contractAddress: `0x${string}`, tokenId: string) => NftData;
type UseNftMintData = (
  contractAddress: `0x${string}`,
  tokenId: string,
  quantity: number,
) => NftMintData;

/**
 * Note: exported as public Type
 */
export type NftViewReact = {
  children: React.ReactNode;
  className?: string;
  contractAddress: `0x${string}`;
  tokenId: string;
  useNftData?: UseNftData; // Optional hook to override the default useNftData hook
  onError?: (error: NftError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // view will not pass transactionReceipt
};

/**
 * Note: exported as public Type
 */
export type NftMintReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  contractAddress: `0x${string}`; // Contract address of the NFT
  tokenId?: string; // Token ID of the NFT only required for ERC1155
  useNftData?: UseNftData; // Optional hook to override the default useNftData hook
  useNftMintData?: UseNftMintData; // Optional hook to override the default useMintData hook
  onError?: (error: NftError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // mint will pass transactionReceipt
};

/**
 * Note: exported as public Type
 */
export type NftError =
  | {
      code: string; // The error code representing the type of nft error.
      error: string; // The error message providing details about the nft error.
      message: string; // The error message providing details about the nft error.
    }
  | TransactionError;

export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: null;
    }
  | {
      statusName: 'error';
      statusData: NftError;
    }
  | {
      statusName: 'mediaLoading';
      statusData: {
        mimeType: string;
        mediaUrl: string;
      };
    }
  | {
      statusName: 'mediaLoaded';
      statusData: null;
    }
  | {
      statusName: 'transactionPending'; // if the mutation is currently executing
      statusData: null;
    }
  | {
      statusName: 'transactionLegacyExecuted';
      statusData: {
        transactionHashList: Address[];
      };
    }
  | {
      statusName: 'success'; // if the last mutation attempt was successful
      statusData: {
        transactionReceipts: TransactionReceipt[];
      };
    };

type LifecycleStatusDataShared = Record<string, never>;

// make all keys in T optional if they are in K
type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

// check if all keys in T are a key of LifecycleStatusDataShared
type AllKeysInShared<T> = keyof T extends keyof LifecycleStatusDataShared
  ? true
  : false;

/**
 * LifecycleStatus updater type
 * Used to type the statuses used to update LifecycleStatus
 * LifecycleStatusData is persisted across state updates allowing SharedData to be optional except for in init step
 */
export type LifecycleStatusUpdate = LifecycleStatus extends infer T
  ? T extends { statusName: infer N; statusData: infer D }
    ? { statusName: N } & (N extends 'init' // statusData required in statusName "init"
        ? { statusData: D }
        : AllKeysInShared<D> extends true // is statusData is LifecycleStatusDataShared, make optional
          ? {
              statusData?: PartialKeys<
                D,
                keyof D & keyof LifecycleStatusDataShared
              >;
            } // make all keys in LifecycleStatusDataShared optional
          : {
              statusData: PartialKeys<
                D,
                keyof D & keyof LifecycleStatusDataShared
              >;
            })
    : never
  : never;
