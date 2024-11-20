export enum OnchainKitComponent {
  Fund = 'fund',
  Identity = 'identity',
  IdentityCard = 'identity-card',
  Checkout = 'checkout',
  Swap = 'swap',
  SwapDefault = 'swap-default',
  Transaction = 'transaction',
  TransactionDefault = 'transaction-default',
  Wallet = 'wallet',
  WalletDefault = 'wallet-default',
  NFTCard = 'nft-card',
  NFTCardDefault = 'nft-card-default',
  NFTMintCard = 'nft-mint-card',
  NFTMintCardDefault = 'nft-mint-card-default',
}

export enum TransactionTypes {
  Calls = 'calls',
  Contracts = 'contracts',
  CallsPromise = 'callsPromise',
  ContractsPromise = 'contractsPromise',
  CallsCallback = 'callsCallback',
  ContractsCallback = 'contractsCallback',
  ContractsAndCalls = 'contractsAndCalls',
}

export type Paymaster = {
  url: string;
  enabled: boolean;
};

export type CheckoutOptions = {
  chargeId?: string;
  productId?: string;
};

export enum CheckoutTypes {
  ChargeID = 'chargeId',
  ProductID = 'productId',
}

export type ComponentTheme =
  | 'base'
  | 'cyberpunk'
  | 'default'
  | 'hacker'
  | 'none'; // Simulates an undefined theme field

export type ComponentMode = 'auto' | 'light' | 'dark';
