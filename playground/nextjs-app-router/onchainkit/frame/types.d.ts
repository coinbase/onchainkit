/// <reference types="react" />
import type { Abi, Address, Hex } from 'viem';
import type { NeynarFrameValidationInternalModel } from '../network/neynar/types';
/**
 * Frame Data
 *
 * Note: exported as public Type
 */
export interface FrameData {
    buttonIndex: number;
    castId: {
        fid: number;
        hash: string;
    };
    inputText: string;
    fid: number;
    messageHash: string;
    network: number;
    state: string;
    timestamp: number;
    transactionId?: string;
    url: string;
}
/**
 * Frame Request
 *
 * Note: exported as public Type
 */
export interface FrameRequest {
    untrustedData: FrameData;
    trustedData: {
        messageBytes: string;
    };
}
/**
 * Simplified Object model with the raw Neynar data if-needed.
 */
export interface FrameValidationData {
    address: string | null;
    button: number;
    following: boolean;
    input: string;
    interactor: {
        fid: number;
        custody_address: string;
        verified_accounts: string[];
        verified_addresses: {
            eth_addresses: string[] | null;
            sol_addresses: string[] | null;
        };
    };
    liked: boolean;
    raw: NeynarFrameValidationInternalModel;
    recasted: boolean;
    state: {
        serialized: string;
    };
    transaction: {
        hash: string;
    } | null;
    valid: boolean;
}
export type FrameValidationResponse = {
    isValid: true;
    message: FrameValidationData;
} | {
    isValid: false;
    message: undefined;
};
export declare function convertToFrame(json: any): {
    fid: any;
    url: any;
    messageHash: any;
    timestamp: any;
    network: any;
    buttonIndex: any;
    castId: {
        fid: any;
        hash: any;
    };
};
/**
 * Note: exported as public Type
 */
export type FrameButtonMetadata = {
    action: 'link' | 'mint';
    label: string;
    target: string;
} | {
    action?: 'post' | 'post_redirect';
    label: string;
    postUrl?: string;
    target?: string;
} | {
    action: 'tx';
    label: string;
    target: string;
    postUrl?: string;
};
/**
 * Note: exported as public Type
 */
export type FrameInputMetadata = {
    text: string;
};
/**
 * Note: exported as public Type
 */
export type FrameImageMetadata = {
    src: string;
    aspectRatio?: '1.91:1' | '1:1';
};
/**
 * Note: exported as public Type
 */
export type FrameMetadataReact = FrameMetadataType & {
    ogDescription?: string;
    ogTitle?: string;
    wrapper?: React.ComponentType<any>;
};
/**
 * Note: exported as public Type
 */
export type FrameMetadataType = {
    accepts?: {
        [protocolIdentifier: string]: string;
    };
    buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]];
    image: string | FrameImageMetadata;
    input?: FrameInputMetadata;
    isOpenFrame?: boolean;
    /** @deprecated Prefer `postUrl` */
    post_url?: string;
    postUrl?: string;
    /** @deprecated Prefer `refreshPeriod` */
    refresh_period?: number;
    refreshPeriod?: number;
    state?: object;
};
/**
 * Note: exported as public Type
 */
export type FrameMetadataResponse = Record<string, string>;
/**
 * Note: exported as public Type
 */
type ChainNamespace = 'eip155' | 'solana';
type ChainReference = string;
export type FrameTransactionResponse = {
    chainId: `${ChainNamespace}:${ChainReference}`;
    method: 'eth_sendTransaction' | 'eth_personalSign';
    params: FrameTransactionEthSendParams;
};
/**
 * Note: exported as public Type
 */
export type FrameTransactionEthSendParams = {
    abi: Abi;
    data?: Hex;
    to: Address;
    value: string;
};
/**
 * Settings to simulate statuses on mock frames.
 *
 * Note: exported as public Type
 */
export type MockFrameRequestOptions = {
    following?: boolean;
    interactor?: {
        fid?: number;
        custody_address?: string;
        verified_accounts?: string[];
    };
    liked?: boolean;
    recasted?: boolean;
};
/**
 * A mock frame request payload
 *
 * Note: exported as public Type
 */
export type MockFrameRequest = FrameRequest & {
    mockFrameData: Required<FrameValidationData>;
};
export {};
//# sourceMappingURL=types.d.ts.map