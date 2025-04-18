export type AccountAssociation = {
  header: string;
  payload: string;
  signature: string;
  domain: string;
};

export type Frame = {
  version: string;
  name: string;
  homeUrl: string;
  iconUrl: string;
  imageUrl?: string;
  buttonTitle?: string;
  splashImageUrl?: string;
  splashBackgroundColor?: string;
  webhookUrl?: string;
};

export type FarcasterManifest = {
  accountAssociation: AccountAssociation;
  frame: Frame;
};

export type FrameMetadata = {
  version: string;
  imageUrl: string;
  button: {
    title: string;
    action: {
      type: 'launch_frame' | 'view_token';
      url?: string;
      name?: string;
      splashImageUrl?: string;
      splashBackgroundColor?: string;
    };
  };
};
