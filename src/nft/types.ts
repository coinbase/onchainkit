import type { ReactNode } from 'react';
import type { Address, Hex, TransactionReceipt } from 'viem';
import type { Call, TransactionError } from '../transaction/types';

export type ContractType = 'ERC721' | 'ERC1155';

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
  name?: string; // required for NFTTitle
  description?: string; // not currently used
  imageUrl?: string; // required for NFTMedia
  animationUrl?: string; // required for NFTMedia (audio and video types)
  mimeType?: string; // required for NFTMedia (falls back to image)
  ownerAddress?: `0x${string}`; // required for NFTOwner
  lastSoldPrice: NftPrice; // required for NFTLastSoldPrice
  contractType?: ContractType; // not currently used
  mintDate?: Date; // required for NFTMintDate

  price?: NftPrice; // required for NFTAssetCost, NftTotalCost
  mintFee?: NftPrice; // required for NFTTotalCost
  creatorAddress?: Hex; // required for NFTCreator
  maxMintsPerWallet?: number; // required for NFTMintButton
  isEligibleToMint?: boolean; // required for NFTMintButton
  totalOwners?: number; // required for NFTMinters
  recentOwners?: Address[]; // required for NFTMinters
};

export type NftContextType = {
  contractAddress: `0x${string}`;
  tokenId?: string;
  quantity: number;
  setQuantity: (quantity: string) => void;
  buildMintTransaction?: BuildMintTransaction;
} & NftData;

export type NftProviderReact = {
  children: ReactNode;
  contractAddress: `0x${string}`;
  tokenId?: string;
  useNftData: UseNftData;
  buildMintTransaction?: BuildMintTransaction;
};

/* Mint Provider */

export type NftPrice = {
  amount?: number;
  currency?: string;
  amountUSD?: number;
};

type UseNftData = (contractAddress: Hex, tokenId?: string) => NftData;

export type BuildMintTransaction = (
  props: BuildMintTransactionDataProps,
) => Promise<Call[]>;

export type BuildMintTransactionDataProps = {
  contractAddress: Hex;
  takerAddress: Address;
  tokenId?: string;
  quantity: number;
};

export type NFTReact = {
  children: ReactNode;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type NftViewReact = {
  children: React.ReactNode;
  className?: string;
  contractAddress: Hex;
  tokenId: string;
  useNftData: UseNftData; // Optional hook to override the default useNftData hook
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
  contractAddress: Hex; // Contract address of the NFT
  tokenId?: string; // Token ID of the NFT only required for ERC1155
  useNftData: UseNftData; // Required hook to supply NFT data
  buildMintTransaction: BuildMintTransaction; // Required function that builds the mint transaction
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
