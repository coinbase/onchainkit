import type { ReactNode } from 'react';
import type { Address, Hex, TransactionReceipt } from 'viem';
import type { Call, TransactionError } from '../transaction/types';

export type ContractType = 'ERC721' | 'ERC1155';

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
} & NFTData;

export type NFTProviderReact = {
  children: ReactNode;
  contractAddress: `0x${string}`;
  tokenId?: string;
  useNFTData: UseNFTData;
};

/* Mint Provider */

export type NFTPrice = {
  amount?: number;
  currency?: string;
  amountUSD?: number;
};

export type NFTMintContextType = {
  quantity: number;
  setQuantity: (quantity: string) => void;
  buildMintTransaction: BuildMintTransaction;
} & NFTMintData;

export type NFTMintProviderReact = {
  useNFTMintData: UseNFTMintData;
  buildMintTransaction: BuildMintTransaction;
  children: ReactNode;
};

type UseNFTData = (contractAddress: Hex, tokenId?: string) => NFTData;

/**
 * Note: exported as public Type
 */
export type NFTData = {
  name?: string;
  description?: string;
  imageUrl?: string;
  animationUrl?: string;
  mimeType?: string;
  ownerAddress?: `0x${string}`;
  lastSoldPrice: NFTPrice;
  contractType?: ContractType;
  mintDate?: Date;
};

export type UseNFTMintDataProps = {
  contractAddress: Hex;
  tokenId?: string;
  quantity: number;
};

type UseNFTMintData = (props: UseNFTMintDataProps) => NFTMintData;

/**
 * Note: exported as public Type
 */
export type NFTMintData = {
  price?: NFTPrice;
  mintFee?: NFTPrice;
  creatorAddress?: Hex;
  maxMintsPerWallet?: number;
  isEligibleToMint?: boolean;
  totalOwners?: number;
  recentOwners?: Address[];
  callData?: {
    data: Hex;
    to: Hex;
    value: bigint;
  }[];
};

type BuildMintTransaction = (
  props: BuildMintTransactionDataProps,
) => Promise<Call[]>;

export type BuildMintTransactionDataProps = {
  contractAddress: Hex;
  takerAddress: Address;
  tokenId?: string;
  quantity: number;
};

/**
 * Note: exported as public Type
 */
export type NFTViewReact = {
  children: React.ReactNode;
  className?: string;
  contractAddress: Hex;
  tokenId: string;
  useNFTData: UseNFTData; // Optional hook to override the default useNftData hook
  onError?: (error: NFTError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // view will not pass transactionReceipt
};

/**
 * Note: exported as public Type
 */
export type NFTMintReact = {
  children: ReactNode;
  className?: string; // Optional className override for top div element.
  contractAddress: Hex; // Contract address of the NFT
  tokenId?: string; // Token ID of the NFT only required for ERC1155
  useNFTData: UseNFTData; // Optional hook to override the default useNftData hook
  useNFTMintData: UseNFTMintData; // Optional hook to override the default useMintData hook
  buildMintTransaction: BuildMintTransaction; // Function that builds the mint transaction
  onError?: (error: NFTError) => void; // An optional callback function that handles errors within the provider.
  onStatus?: (lifecycleStatus: LifecycleStatus) => void; // An optional callback function that exposes the component lifecycle state
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void; // mint will pass transactionReceipt
};

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
