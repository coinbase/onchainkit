import type { UseQueryOptions } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { Address, Hex, TransactionReceipt } from 'viem';
import type {
  ContractType,
  GetMintDetailsParams,
  GetTokenDetailsParams,
  NFTError,
  NFTPrice,
} from '../api/types';
import type { LifecycleStatusUpdate } from '../internal/types';
import type { Call } from '../transaction/types';

export enum MediaType {
  Image = 'image',
  Video = 'video',
  Audio = 'audio',
  Unknown = 'unknown',
}

/**
 * Lifecycle Provider
 */
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
  updateLifecycleStatus: (
    status: LifecycleStatusUpdate<LifecycleStatus>,
  ) => void;
};

/**
 * NFT Provider
 */
export type NFTContextType = {
  contractAddress: `0x${string}`;
  tokenId?: string;
  /** Optional boolean to determine if the mint is sponsored by paymaster */
  isSponsored?: boolean;
  quantity: number;
  setQuantity: (quantity: string) => void;
  buildMintTransaction?: BuildMintTransaction;
} & NFTData;

export type NFTProviderReact = {
  children: ReactNode;
  contractAddress: `0x${string}`;
  tokenId?: string;
  /** Optional boolean to determine if the mint is sponsored by paymaster */
  isSponsored?: boolean;
  useNFTData: UseNFTData;
  buildMintTransaction?: BuildMintTransaction;
};

/**
 * Note: exported as public Type
 */
export type UseNFTData = (
  /** Contract address of the NFT */
  contractAddress: Hex,
  /** Token ID of the NFT */
  tokenId?: string,
) => NFTData | NFTError;

/**
 * Note: exported as public Type
 */
export type NFTData = {
  /** required for NFTTitle and NFTCollectionTitle */
  name?: string;
  /** not currently used */
  description?: string;
  /** required for NFTMedia */
  imageUrl?: string;
  /** required for NFTMedia (audio and video types) */
  animationUrl?: string;
  /** supported mimeTypes:
   * image = image/*
   * video = video/*
   * audio = audio/* | application/*
   */
  /** required for NFTLastSoldPrice */
  lastSoldPrice?: NFTPrice;
  /** required for NFTMedia (falls back to image) */
  mimeType?: string;

  /** required for NFTOwner */
  ownerAddress?: `0x${string}`;
  /** not currently used */
  contractType?: ContractType;
  /** required for NFTMintDate */
  mintDate?: Date;
  /** required for NFTAssetCost, NftTotalCost */
  price?: NFTPrice;
  /** required for NFTTotalCost */
  mintFee?: NFTPrice;
  /** required for NFTCreator */
  creatorAddress?: Hex;
  /** required for NFTMintButton */
  maxMintsPerWallet?: number;
  /** required for NFTMintButton */
  isEligibleToMint?: boolean;
  /** required for NFTMinters */
  totalOwners?: string;
  /** required for NFTMinters */
  recentOwners?: Address[];
  /** required for default BuildMintTransaction implementation */
  network?: string;
};

/**
 * Note: exported as public Type
 */
export type BuildMintTransaction = (
  props: BuildMintTransactionDataProps,
) => Promise<Call[]>;

export type BuildMintTransactionDataProps = {
  /** Contract address of the NFT */
  contractAddress: Hex;
  /** Address of the taker */
  takerAddress: Address;
  /** Token ID of the NFT */
  tokenId?: string;
  /** Quantity of the NFT to mint */
  quantity: number;
  /** Network of the NFT */
  network?: string;
};

/**
 * Note: exported as public Type
 */
export type UseTokenDetailsParams<T> = GetTokenDetailsParams & {
  queryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;
};

/**
 * Note: exported as public Type
 */
export type UseMintDetailsParams<T> = GetMintDetailsParams & {
  queryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;
};

export type NFTReact = {
  children: ReactNode;
  className?: string;
};

/**
 * Note: exported as public Type
 */
export type NFTCardReact = {
  children?: React.ReactNode;
  /** Optional className override for top div element. */
  className?: string;
  /** Contract address of the NFT */
  contractAddress: Hex;
  /** Required Token ID of the NFT */
  tokenId: string;
  /** Optional hook to override the default useNftData hook */
  useNFTData?: UseNFTData;
  /** An optional callback function that handles errors within the provider. */
  onError?: (error: NFTError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** card will not pass transactionReceipt */
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
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
  children?: ReactNode;
  /** Optional className override for top div element. */
  className?: string;
  /** Contract address of the NFT */
  contractAddress: Hex;
  /** Token ID of the NFT only required for ERC1155 */
  tokenId?: string;
  /** Optional boolean to determine if the mint is sponsored by paymaster */
  isSponsored?: boolean;
  /** Optional hook to override the default useNFTData hook */
  useNFTData?: UseNFTData;
  /** Optional function to override the default function that builds the mint transaction */
  buildMintTransaction?: BuildMintTransaction;
  /** An optional callback function that handles errors within the provider. */
  onError?: (error: NFTError) => void;
  /** An optional callback function that exposes the component lifecycle state */
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  /** mint will pass transactionReceipt */
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
};

/**
 * Note: exported as public Type
 */
export type NFTMintCardDefaultReact = Omit<NFTMintCardReact, 'children'>;

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
