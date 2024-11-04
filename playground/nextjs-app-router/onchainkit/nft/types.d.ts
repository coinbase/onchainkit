import type { ReactNode } from 'react';
import type { Address, Hex, TransactionReceipt } from 'viem';
import type { Call, TransactionError } from '../transaction/types';
export type ContractType = 'ERC721' | 'ERC1155';
export declare enum MediaType {
    Image = "image",
    Video = "video",
    Audio = "audio",
    Unknown = "unknown"
}
export declare enum LifecycleType {
    VIEW = "view",
    MINT = "mint"
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
export type NFTContextType = {
    contractAddress: `0x${string}`;
    tokenId?: string;
    isSponsored?: boolean;
    quantity: number;
    setQuantity: (quantity: string) => void;
    buildMintTransaction?: BuildMintTransaction;
} & NFTData;
export type NFTProviderReact = {
    children: ReactNode;
    contractAddress: `0x${string}`;
    tokenId?: string;
    isSponsored?: boolean;
    useNFTData: UseNFTData;
    buildMintTransaction?: BuildMintTransaction;
};
export type NFTPrice = {
    amount?: string;
    currency?: string;
    amountUSD?: string;
};
type UseNFTData = (contractAddress: Hex, // Contract address of the NFT
tokenId?: string) => NFTData | NFTError;
/**
 * Note: exported as public Type
 */
export type NFTData = {
    name?: string;
    description?: string;
    imageUrl?: string;
    animationUrl?: string;
    lastSoldPrice?: NFTPrice;
    mimeType?: string;
    ownerAddress?: `0x${string}`;
    contractType?: ContractType;
    mintDate?: Date;
    price?: NFTPrice;
    mintFee?: NFTPrice;
    creatorAddress?: Hex;
    maxMintsPerWallet?: number;
    isEligibleToMint?: boolean;
    totalOwners?: string;
    recentOwners?: Address[];
    network?: string;
};
type BuildMintTransaction = (props: BuildMintTransactionDataProps) => Promise<Call[]>;
export type BuildMintTransactionDataProps = {
    contractAddress: Hex;
    takerAddress: Address;
    tokenId?: string;
    quantity: number;
    network?: string;
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
    className?: string;
    contractAddress: Hex;
    tokenId: string;
    useNFTData?: UseNFTData;
    onError?: (error: NFTError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
};
/**
 * Note: exported as public Type
 * NFTMint must be used if the NFTMintButton is included
 */
export type NFTMintCardReact = {
    children: ReactNode;
    className?: string;
    contractAddress: Hex;
    tokenId?: string;
    isSponsored?: boolean;
    useNFTData?: UseNFTData;
    buildMintTransaction?: BuildMintTransaction;
    onError?: (error: NFTError) => void;
    onStatus?: (lifecycleStatus: LifecycleStatus) => void;
    onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
};
/**
 * Note: exported as public Type
 */
export type NFTError = {
    code: string;
    error: string;
    message: string;
} | TransactionError;
export type LifecycleStatus = {
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
type LifecycleStatusDataShared = Record<string, never>;
type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>> extends infer O ? {
    [P in keyof O]: O[P];
} : never;
type AllKeysInShared<T> = keyof T extends keyof LifecycleStatusDataShared ? true : false;
/**
 * LifecycleStatus updater type
 * Used to type the statuses used to update LifecycleStatus
 * LifecycleStatusData is persisted across state updates allowing SharedData to be optional except for in init step
 */
export type LifecycleStatusUpdate = LifecycleStatus extends infer T ? T extends {
    statusName: infer N;
    statusData: infer D;
} ? {
    statusName: N;
} & (N extends 'init' ? {
    statusData: D;
} : AllKeysInShared<D> extends true ? {
    statusData?: PartialKeys<D, keyof D & keyof LifecycleStatusDataShared>;
} : {
    statusData: PartialKeys<D, keyof D & keyof LifecycleStatusDataShared>;
}) : never : never;
export {};
//# sourceMappingURL=types.d.ts.map