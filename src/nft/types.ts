import type { ReactNode } from 'react';
import type { Address, Hex, TransactionReceipt } from 'viem';
import type { Call, TransactionError } from '../transaction/types';

export type ContractType = 'ERC721' | 'ERC1155';

export enum MediaType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Unknown = 'unknown',
}

/* Lifecycle Provider */

export enum LifecycleType {
  VIEW = 'view',
  MINT = 'mint',
}

export type NFTLifecycleProviderReact = {
  type: LifecycleType;
  onError?: (error: NFTError) => void;
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
  children: ReactNode;
};

export type NFTLifecycleContextType = {
  type: LifecycleType;
  lifecycleStatus: LifecycleStatus;
  updateLifecycleStatus: (status: LifecycleStatusUpdate) => void;
};

/* NFT Provider */

export type NFTContextType = {
  contractAddress: `0x${string}`;
  tokenId?: string;
  isSponsored?: boolean; // Optional boolean to determine if the mint is sponsored by paymaster
  quantity: number;
  setQuantity: (quantity: string) => void;
  buildMintTransaction?: BuildMintTransaction;
} & NFTData;

export type NFTProviderReact = {
  children: ReactNode;
  contractAddress: `0x${string}`;
  tokenId?: string;
  isSponsored?: boolean; // Optional boolean to determine if the mint is sponsored by paymaster
  useNFTData: UseNFTData;
  buildMintTransaction?: BuildMintTransaction;
};

export type NFTPrice = {
  amount?: string; // Amount in Currency
  currency?: string; // Currency
  amountUSD?: string; // Amount in USD
};

/**
 * Note: exported as public Type
 */
export type UseNFTData = (
  contractAddress: Hex, // Contract address of the NFT
  tokenId?: string, // Token ID of the NFT
) => NFTData | NFTError;

/**
 * Note: exported as public Type
 */
export type NFTData = {
  // card components
  name?: string; // required for NFTTitle and NFTCollectionTitle
  description?: string; // not currently used
  imageUrl?: string; // required for NFTMedia
  animationUrl?: string; // required for NFTMedia (audio and video types)
  /* supported mimeTypes:
   * image = image/*
   * video = video/*
   * audio = audio/* | application/*
   */
  lastSoldPrice?: NFTPrice; // required for NFTLastSoldPrice
  mimeType?: string; // required for NFTMedia (falls back to image)

  // mint components
  ownerAddress?: `0x${string}`; // required for NFTOwner
  contractType?: ContractType; // not currently used
  mintDate?: Date; // required for NFTMintDate
  price?: NFTPrice; // required for NFTAssetCost, NftTotalCost
  mintFee?: NFTPrice; // required for NFTTotalCost
  creatorAddress?: Hex; // required for NFTCreator
  maxMintsPerWallet?: number; // required for NFTMintButton
  isEligibleToMint?: boolean; // required for NFTMintButton
  totalOwners?: string; // required for NFTMinters
  recentOwners?: Address[]; // required for NFTMinters
  network?: string; // required for default BuildMintTransaction implementation
};

/**
 * Note: exported as public Type
 */
export type BuildMintTransaction = (
  props: BuildMintTransactionDataProps,
) => Promise<Call[]>;

export type BuildMintTransactionDataProps = {
  contractAddress: Hex; // Contract address of the NFT
  takerAddress: Address; // Address of the taker
  tokenId?: string; // Token ID of the NFT
  quantity: number; // Quantity of the NFT to mint
  network?: string; // Network of the NFT
};

export type NFTReact = {
  children: ReactNode;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type NFTCardReact = {
  children: React.ReactNode;
  className?: string; // Optional className override for top div element.
  contractAddress: Hex; // Contract address of the NFT
  tokenId: string; // Required Token ID of the NFT
  useNFTData?: UseNFTData; // Optional hook to override the default useNftData hook
  onError?: (error: NFTError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // card will not pass transactionReceipt
};

/**
 * Note: exported as public Type
 */

export type NFTCardDefaultReact = Omit<NFTCardReact, 'children'>;

/**
 * Note: exported as public Type
 * NFTMint must be used if the NFTMintButton is included
 */
export type NFTMintCardReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  contractAddress: Hex; // Contract address of the NFT
  tokenId?: string; // Token ID of the NFT only required for ERC1155
  isSponsored?: boolean; // Optional boolean to determine if the mint is sponsored by paymaster
  useNFTData?: UseNFTData; // Optional hook to override the default useNFTData hook
  buildMintTransaction?: BuildMintTransaction; // Optional function to override the default function that builds the mint transaction
  onError?: (error: NFTError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // mint will pass transactionReceipt
};

/**
/**
 * Note: exported as public Type
 */
export type NFTMintCardDefaultReact = Omit<NFTMintCardReact, 'children'>;

/**
/**
 * Note: exported as public Type
 */
export type NFTError =
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
      statusData: NFTError;
    }
  | {
      statusName: 'mediaLoading';
      statusData: {
        mediaType: MediaType;
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
      statusName: 'success'; // NFTCard success state represents media loaded, NFTMintCard success state represents successful Mint
      statusData: {
        transactionReceipts?: TransactionReceipt[];
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
