export const OnchainKitComponent = {
  FundButton: 'fund-button',
  FundButtonWithRenderProp: 'fund-button-with-render-prop',
  FundCard: 'fund-card',
  Buy: 'buy',
  Identity: 'identity',
  IdentityCard: 'identity-card',
  Checkout: 'checkout',
  Swap: 'swap',
  SwapDefault: 'swap-default',
  Transaction: 'transaction',
  TransactionWithRenderProp: 'transaction-with-render-prop',
  TransactionDefault: 'transaction-default',
  Wallet: 'wallet',
  WalletDefault: 'wallet-default',
  WalletIsland: 'wallet-island',
  WalletAdvancedDefault: 'wallet-advanced-default',
  NFTCard: 'nft-card',
  NFTCardDefault: 'nft-card-default',
  NFTMintCard: 'nft-mint-card',
  NFTMintCardDefault: 'nft-mint-card-default',
  Earn: 'earn',
  Signature: 'signature',
} as const;

export const TransactionTypes = {
  Calls: 'calls',
  Contracts: 'contracts',
  CallsPromise: 'callsPromise',
  ContractsPromise: 'contractsPromise',
  CallsCallback: 'callsCallback',
  ContractsCallback: 'contractsCallback',
  ContractsAndCalls: 'contractsAndCalls',
} as const;
export type TransactionTypesType =
  (typeof TransactionTypes)[keyof typeof TransactionTypes];

export type Paymaster = {
  url: string;
  enabled: boolean;
};

export type CheckoutOptions = {
  chargeId?: string;
  productId?: string;
};

export const CheckoutTypes = {
  ChargeID: 'chargeId',
  ProductID: 'productId',
} as const;

export type CheckoutTypesType =
  (typeof CheckoutTypes)[keyof typeof CheckoutTypes];

export type ComponentTheme =
  | 'base'
  | 'cyberpunk'
  | 'default'
  | 'hacker'
  | 'none'; // Simulates an undefined theme field

export type ComponentMode = 'auto' | 'light' | 'dark';
