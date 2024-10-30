import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { Hex, Address, TransactionReceipt } from 'viem';
import { T as TransactionError, C as Call } from '../types-CAfIXkWi.js';

type ContractType = 'ERC721' | 'ERC1155';
declare enum MediaType {
    Image = "image",
    Video = "video",
    Audio = "audio",
    Unknown = "unknown"
}
type NFTPrice = {
    amount?: number;
    currency?: string;
    amountUSD?: number;
};
type UseNFTData = (contractAddress: Hex, tokenId?: string) => NFTData;
/**
 * Note: exported as public Type
 */
type NFTData = {
    name?: string;
    description?: string;
    imageUrl?: string;
    animationUrl?: string;
    mimeType?: string;
    ownerAddress?: `0x${string}`;
    lastSoldPrice: NFTPrice;
    contractType?: ContractType;
    mintDate?: Date;
    price?: NFTPrice;
    mintFee?: NFTPrice;
    creatorAddress?: Hex;
    maxMintsPerWallet?: number;
    isEligibleToMint?: boolean;
    totalOwners?: number;
    recentOwners?: Address[];
};
type BuildMintTransaction = (props: BuildMintTransactionDataProps) => Promise<Call[]>;
type BuildMintTransactionDataProps = {
    contractAddress: Hex;
    takerAddress: Address;
    tokenId?: string;
    quantity: number;
};
/**
 * Note: exported as public Type
 */
type NFTCardReact = {
    children: React.ReactNode;
    className?: string;
    contractAddress: Hex;
    tokenId: string;
    useNFTData: UseNFTData;
    onError?: (error: NFTError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
};
/**
 * Note: exported as public Type
 * NFTMint must be used if the NFTMintButton is included
 */
type NFTMintCardReact = {
    children: ReactNode;
    className?: string;
    contractAddress: Hex;
    tokenId?: string;
    isSponsored?: boolean;
    useNFTData: UseNFTData;
    buildMintTransaction: BuildMintTransaction;
    onError?: (error: NFTError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
};
/**
 * Note: exported as public Type
 */
type NFTError = {
    code: string;
    error: string;
    message: string;
} | TransactionError;
type LifecycleStatus = {
    statusName: 'init';
    statusData: null;
} | {
    statusName: 'error';
    statusData: NFTError;
} | {
    statusName: 'mediaLoading';
    statusData: {
        mediaType: MediaType;
        mediaUrl: string;
    };
} | {
    statusName: 'mediaLoaded';
    statusData: null;
} | {
    statusName: 'transactionPending';
    statusData: null;
} | {
    statusName: 'transactionLegacyExecuted';
    statusData: {
        transactionHashList: Address[];
    };
} | {
    statusName: 'success';
    statusData: {
        transactionReceipts: TransactionReceipt[];
    };
};

declare function NFTMintCard({ children, className, contractAddress, tokenId, isSponsored, useNFTData, buildMintTransaction, onStatus, onError, onSuccess, }: NFTMintCardReact): react_jsx_runtime.JSX.Element | null;

declare function NFTCard({ children, className, contractAddress, tokenId, useNFTData, onStatus, onError, onSuccess, }: NFTCardReact): react_jsx_runtime.JSX.Element | null;

export { type LifecycleStatus, NFTCard, type NFTCardReact, type NFTData, type NFTError, NFTMintCard, type NFTMintCardReact };
