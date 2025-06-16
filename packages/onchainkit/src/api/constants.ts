export const ApiErrorCode = {
  AMGTa01: 'AmGTa01', // Api module Get Tokens api Error O1
  AMGTa02: 'AmGTa02', // Api module Get Tokens api Error O2
  AmBSeTx01: 'AmBSeTx01', // Api Module Build Send Transaction Error 01
  UncaughtNft: 'uncaught-nft',
  UncaughtPriceQuoteError: 'UNCAUGHT_PRICE_QUOTE_ERROR',
  InvalidInput: 'INVALID_INPUT',
  UncaughtPortfolioError: 'uncaught-portfolio',
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];
