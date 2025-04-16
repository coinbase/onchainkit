export type AccountAssociation = {
  header: string;
  payload: string;
  signature: string;
  domain: string;
};

export type Frame = {
  buttonTitle?: string;
  homeUrl?: string;
  iconUrl?: string;
  imageUrl?: string;
  name?: string;
  splashBackgroundColor?: string;
  splashImageUrl?: string;
  version?: string;
  webhookUrl?: string;
};

export type FarcasterJson = {
  accountAssociation: AccountAssociation;
  frame: Frame;
};
