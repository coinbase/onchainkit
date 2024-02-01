export interface FrameRequest {
  untrustedData: FrameData;
  trustedData: {
    messageBytes: string;
  };
}

export type FrameValidationResponse =
  | { isValid: true; message: FrameData }
  | { isValid: false; message: undefined };

export interface FrameData {
  fid: number;
  url: string;
  messageHash: string;
  timestamp: number;
  network: number;
  buttonIndex: number;
  castId: {
    fid: number;
    hash: string;
  };
}

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

export type FrameButtonMetadata = {
  label: string;
  action?: 'post' | 'post_redirect';
};

export type FrameMetadata = {
  buttons?: [FrameButtonMetadata, ...FrameButtonMetadata[]];
  image: string;
  post_url?: string;
  refresh_period?: number;
};
