import { Abi, Hex, Address } from 'viem';

/**
 * Raw Response from Neynar
 */
interface NeynarFrameValidationInternalModel {
    valid: boolean;
    action: {
        address?: string;
        object: string;
        interactor: {
            object: string;
            fid: number;
            custody_address: string;
            username: null | string;
            display_name: string;
            pfp_url: string;
            profile: {
                bio: {
                    text: string;
                    mentioned_profiles?: any[];
                };
            };
            follower_count: number;
            following_count: number;
            verifications: any[];
            verified_addresses: {
                eth_addresses: string[] | null;
                sol_addresses: string[] | null;
            };
            active_status: string;
            viewer_context: {
                following: boolean;
                followed_by: boolean;
            };
        };
        tapped_button: {
            index: number;
        };
        input: {
            text: string;
        };
        url: string;
        state: {
            serialized: string;
        };
        cast: {
            object: string;
            hash: string;
            thread_hash: string;
            parent_hash: null | string;
            parent_url: string;
            root_parent_url: string;
            parent_author: {
                fid: null | number;
            };
            author: {
                object: string;
                fid: number;
                custody_address: string;
                username: string;
                display_name: string;
                pfp_url: string;
                profile: {
                    bio: {
                        text: string;
                        mentioned_profiles?: any[];
                    };
                };
                follower_count: number;
                following_count: number;
                verifications: any[];
                active_status: string;
                viewer_context: {
                    liked: boolean;
                    recasted: boolean;
                };
            };
            text: string;
            timestamp: string;
            embeds: {
                url: string;
            }[];
            frames: {
                version: string;
                title: string;
                image: string;
                image_aspect_ratio: string;
                buttons: {
                    index: number;
                    title: string;
                    action_type: string;
                }[];
                input: {
                    text?: string;
                };
                state: {
                    serialized?: string;
                };
                post_url: string;
                frames_url: string;
            }[];
            reactions: {
                likes: {
                    fid: number;
                    fname: string;
                }[];
                recasts: {
                    fid: number;
                    fname: string;
                }[];
            };
            replies: {
                count: number;
            };
            mentioned_profiles: {
                object: string;
                fid: number;
                custody_address: string;
                username: string;
                display_name: string;
                pfp_url: string;
                profile: {
                    bio: {
                        text: string;
                        mentioned_profiles?: any[];
                    };
                };
                follower_count: number;
                following_count: number;
                verifications: any[];
                active_status: string;
            }[];
            viewer_context: {
                liked: boolean;
                recasted: boolean;
            };
        };
        timestamp: string;
        transaction?: {
            hash: string;
        };
    };
}

/**
 * Frame Data
 *
 * Note: exported as public Type
 */
interface FrameData {
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
interface FrameRequest {
    untrustedData: FrameData;
    trustedData: {
        messageBytes: string;
    };
}
/**
 * Simplified Object model with the raw Neynar data if-needed.
 */
interface FrameValidationData {
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
type FrameValidationResponse = {
    isValid: true;
    message: FrameValidationData;
} | {
    isValid: false;
    message: undefined;
};
/**
 * Note: exported as public Type
 */
type FrameButtonMetadata = {
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
type FrameInputMetadata = {
    text: string;
};
/**
 * Note: exported as public Type
 */
type FrameImageMetadata = {
    src: string;
    aspectRatio?: '1.91:1' | '1:1';
};
/**
 * Note: exported as public Type
 */
type FrameMetadataReact = FrameMetadataType & {
    ogDescription?: string;
    ogTitle?: string;
    wrapper?: React.ComponentType<any>;
};
/**
 * Note: exported as public Type
 */
type FrameMetadataType = {
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
type FrameMetadataResponse = Record<string, string>;
/**
 * Note: exported as public Type
 */
type ChainNamespace = 'eip155' | 'solana';
type ChainReference = string;
type FrameTransactionResponse = {
    chainId: `${ChainNamespace}:${ChainReference}`;
    method: 'eth_sendTransaction' | 'eth_personalSign';
    params: FrameTransactionEthSendParams;
};
/**
 * Note: exported as public Type
 */
type FrameTransactionEthSendParams = {
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
type MockFrameRequestOptions = {
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
type MockFrameRequest = FrameRequest & {
    mockFrameData: Required<FrameValidationData>;
};

type FrameMetadataHtmlResponse = FrameMetadataType & {
    ogDescription?: string;
    ogTitle?: string;
};
/**
 * Returns an HTML string containing metadata for a new valid frame.
 */
declare function getFrameHtmlResponse({ accepts, buttons, image, input, isOpenFrame, ogDescription, ogTitle, postUrl, post_url, refreshPeriod, refresh_period, state, }: FrameMetadataHtmlResponse): string;

/**
 * This function generates the metadata for a Farcaster Frame.
 */
declare const getFrameMetadata: ({ accepts, buttons, image, input, isOpenFrame, postUrl, post_url, refreshPeriod, refresh_period, state, }: FrameMetadataType) => FrameMetadataResponse;

type FrameMessageOptions = {
    neynarApiKey?: string;
    castReactionContext?: boolean;
    followContext?: boolean;
    allowFramegear?: boolean;
} | undefined;
/**
 * Given a frame message, decode and validate it.
 * If message is valid, return the message. Otherwise undefined.
 */
declare function getFrameMessage(body: FrameRequest | MockFrameRequest, messageOptions?: FrameMessageOptions): Promise<FrameValidationResponse>;

/**
 * Modify a standard frame request to include simulated values (e.g., indicate the viewer
 * follows the cast author) for development/debugging purposes.
 * @param request A standard frame request.
 * @param options An object containing values we will pretend are real for the purposes of debugging.
 * @returns
 */
declare function getMockFrameRequest(request: FrameRequest, options?: MockFrameRequestOptions): MockFrameRequest;

export { type FrameMetadataReact as F, type MockFrameRequest as M, getFrameMetadata as a, getFrameMessage as b, getMockFrameRequest as c, type FrameButtonMetadata as d, type FrameData as e, type FrameImageMetadata as f, getFrameHtmlResponse as g, type FrameInputMetadata as h, type FrameMetadataType as i, type FrameRequest as j, type FrameValidationData as k, type FrameTransactionResponse as l, type FrameTransactionEthSendParams as m, type MockFrameRequestOptions as n };
