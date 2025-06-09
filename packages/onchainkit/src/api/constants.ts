export const ApiErrorCode = {
  AMGTa01: 'AmGTa01', // Api module Get Tokens api Error O1
  AMGTa02: 'AmGTa02', // Api module Get Tokens api Error O2
  uncaughtNft: 'uncaught-nft',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];
