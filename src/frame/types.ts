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
  timestamp: number;
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
      action: 'link' | 'mint' | 'tx';
      label: string;
      target: string;
    }
  | {
      action?: 'post' | 'post_redirect';
      label: string;
      target?: string;
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
  // A list of strings which are the label for the buttons in the frame (max 4 buttons).
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]];
  // An image which must be smaller than 10MB and should have an aspect ratio of 1.91:1
  image: string | FrameImageMetadata;
  // The text input to use for the Frame.
  input?: FrameInputMetadata;
  /** @deprecated Prefer `postUrl` */
  post_url?: string;
  // A valid POST URL to send the Signature Packet to.
  postUrl?: string;
  /** @deprecated Prefer `refreshPeriod` */
  refresh_period?: number;
  // A period in seconds at which the app should expect the image to update.
  refreshPeriod?: number;
  // A string containing serialized state (e.g. JSON) passed to the frame server.
  state?: object;
};

/**
 * Note: exported as public Type
 */
export type FrameMetadataResponse = Record<string, string>;

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
