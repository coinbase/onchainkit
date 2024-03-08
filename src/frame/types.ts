import type { Abi, Address, Hex } from 'viem';
import { NeynarFrameValidationInternalModel } from '../utils/neynar/frame/types';

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
  button: number; // Number of the button clicked
  following: boolean; // Indicates if the viewer clicking the frame follows the cast author
  input: string; // Text input from the viewer typing in the frame
  interactor: {
    fid: number; // Viewer Farcaster ID
    custody_address: string; // Viewer custody address
    verified_accounts: string[]; // Viewer account addresses
    verified_addresses: {
      eth_addresses: string[] | null;
      sol_addresses: string[] | null;
    };
  };
  liked: boolean; // Indicates if the viewer clicking the frame liked the cast
  raw: NeynarFrameValidationInternalModel;
  recasted: boolean; // Indicates if the viewer clicking the frame recasted the cast
  state: {
    serialized: string; // Serialized state (e.g. JSON) passed to the frame server
  };
  valid: boolean; // Indicates if the frame is valid
}

export type FrameValidationResponse =
  | { isValid: true; message: FrameValidationData }
  | { isValid: false; message: undefined };

export function convertToFrame(json: any) {
  return {
    fid: json.fid,
    url: json.frameActionBody?.url.toString(),
    messageHash: json.messageHash,
    timestamp: json.timestamp,
    network: json.network,
    buttonIndex: json.frameActionBody?.buttonIndex,
    castId: {
      fid: json.frameActionBody?.castId?.fid,
      hash: json.frameActionBody?.castId?.hash,
    },
  };
}

/**
 * Note: exported as public Type
 */
export type FrameButtonMetadata =
  | {
      action: 'link' | 'mint';
      label: string;
      target: string;
    }
  | {
      action?: 'post' | 'post_redirect';
      label: string;
      target?: string;
    }
  | {
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
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]]; // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  image: string | FrameImageMetadata; // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  input?: FrameInputMetadata; // The text input to use for the Frame.
  /** @deprecated Prefer `postUrl` */
  post_url?: string;
  postUrl?: string; // A valid POST URL to send the Signature Packet to.
  /** @deprecated Prefer `refreshPeriod` */
  refresh_period?: number;
  refreshPeriod?: number; // A period in seconds at which the app should expect the image to update.
  state?: object; // A string containing serialized state (e.g. JSON) passed to the frame server.
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
  chainId: `${ChainNamespace}:${ChainReference}`; // A CAIP-2 chain ID to identify the tx network
  method: 'eth_sendTransaction'; // A method ID to identify the type of tx request.
  params: FrameTransactionEthSendParams; // Specific parameters for chainId and method
};

/**
 * Note: exported as public Type
 */
export type FrameTransactionEthSendParams = {
  abi: Abi; // The contract ABI for the contract to call.
  data?: Hex; // The data to send with the transaction.
  to: Address; // The address of the contract to call.
  value: string; // The amount of Wei to send with the transaction
};

/**
 * Settings to simulate statuses on mock frames.
 *
 * Note: exported as public Type
 */
export type MockFrameRequestOptions = {
  following?: boolean; // Indicates if the viewer clicking the frame follows the cast author
  interactor?: {
    fid?: number; // Viewer Farcaster ID
    custody_address?: string; // Viewer custody address
    verified_accounts?: string[]; // Viewer account addresses
  };
  liked?: boolean; // Indicates if the viewer clicking the frame liked the cast
  recasted?: boolean; // Indicates if the viewer clicking the frame recasted the cast
};

/**
 * A mock frame request payload
 *
 * Note: exported as public Type
 */
export type MockFrameRequest = FrameRequest & { mockFrameData: Required<FrameValidationData> };
