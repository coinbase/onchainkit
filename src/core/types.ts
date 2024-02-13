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
 * Frame Request
 *
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
    };

/**
 * Frame Request
 *
 * Note: exported as public Type
 */
export type FrameInputMetadata = {
  text: string;
};

/**
 * Frame Request
 *
 * Note: exported as public Type
 */
export type FrameImageMetadata = {
  src: string;
  aspectRatio?: '1.91:1' | '1:1';
};

/**
 * Frame Request
 *
 * Note: exported as public Type
 */
export type FrameMetadataType = {
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]];
  image: string | FrameImageMetadata;
  input?: FrameInputMetadata;
  /** @deprecated Prefer `postUrl` */
  post_url?: string;
  postUrl?: string;
  /** @deprecated Prefer `refreshPeriod` */
  refresh_period?: number;
  refreshPeriod?: number;
};

/**
 * Frame Metadata Response
 *
 * Note: exported as public Type
 */
export type FrameMetadataResponse = Record<string, string>;


/**
 * EASAttestation
 *
 * Note: exported as public Type
 */

export type EASSchemaName = string;

export type EASSchemaUid = `0x${string}`;

export type EASSchemaUids = Record<EASSchemaName, EASSchemaUid>;

export type EASChainDefinition = {
  id: number;
  easGraphqlAPI: string;
  schemaUids: EASSchemaUids;
  attesterAddresses: `0x${string}`[];
}

export type EASSupportedChains = Record<number, EASChainDefinition>;

export type EASSupportedSchemas = Record<number, EASSchemaUids>;

/**
 * EASAttestation
 *
 * Note: exported as public Type
 */
export type EASAttestation = {
  id: string;
  decodedDataJson: string;
  recipient: String;
  attester: String;
  time: number;
  timeCreated: number;
  expirationTime: number;
  revocationTime: number;
  revoked: boolean;
  txid: string;
  schemaId: string;
}

export interface EASAttestationWhereInput {
  // Define properties according to your schema
  AND?: Record<string, any>[];
}

export type OrderDirection = 'asc' | 'desc';

export interface EASAttestationOrderByWithRelationInput {
  timeCreated?: OrderDirection;
  // Include other fields from the EASAttestation type that you may want to order by
}

export interface EASAttestationsQueryResponse {
  attestations: EASAttestation[];
}

export type EASAttestationsQueryVariables = {
  where: EASAttestationWhereInput;
  orderBy: EASAttestationOrderByWithRelationInput[];
  distinct: string[];
  take: number;
}
