export const ApiErrorCode = {
  AMGTa01: 'AmGTa01', // Api module Get Tokens api Error O1
  AMGTa02: 'AmGTa02', // Api module Get Tokens api Error O2
  AmBSeTx01: 'AmBSeTx01', // Api Module Build Send Transaction Error 01
  UncaughtNft: 'uncaught-nft',
  UncaughtPriceQuoteError: 'UNCAUGHT_PRICE_QUOTE_ERROR',
  InvalidInput: 'INVALID_INPUT',
  UncaughtPortfolioError: 'uncaught-portfolio',
  AmBPTa01: 'AmBPTa01', // Api Module Build Pay Transaction Error 01
  AmBPTa02: 'AmBPTa02', // Api Module Build Pay Transaction Error 02
  AmBPTa03: 'AmBPTa03', // Api Module Build Pay Transaction Error 03
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];
