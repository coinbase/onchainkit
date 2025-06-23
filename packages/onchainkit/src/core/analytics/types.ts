import type { Hex } from 'viem';

/**
 * Wallet component events - Tracks all possible wallet interaction states
 * Used to monitor wallet connection flow and user interactions
 */
export enum WalletEvent {
  /** Wallet connection fails */
  ConnectError = 'walletConnectError',
  /** User clicks connect wallet button */
  ConnectInitiated = 'walletConnectInitiated',
  /** Wallet successfully connected */
  ConnectSuccess = 'walletConnectSuccess',
  /** User disconnects wallet */
  Disconnect = 'walletDisconnect',
  /** User selects a wallet option */
  OptionSelected = 'walletOptionSelected',
  /** User cancels wallet connection */
  ConnectCanceled = 'walletConnectCanceled',
}

/**
 * Wallet option - Available actions in the wallet interface
 * Used to track which wallet features users interact with
 */
export enum WalletOption {
  Buy = 'buy',
  Explorer = 'explorer',
  QR = 'qr',
  Refresh = 'refresh',
  Send = 'send',
  Swap = 'swap',
}

/**
 * Swap component events
 */
export enum SwapEvent {
  SlippageChanged = 'swapSlippageChanged',
  TokenSelected = 'swapTokenSelected',
  SwapSuccess = 'swapSuccess',
  SwapInitiated = 'swapInitiated',
  SwapFailure = 'swapFailure',
  SwapCanceled = 'swapCanceled',
}

/**
 * Buy option - Available payment methods for buying
 * Used to track which payment method users select
 */
export enum BuyOption {
  APPLE_PAY = 'apple_pay',
  COINBASE = 'coinbase_account',
  DEBIT_CARD = 'debit_card',
  ETH = 'eth',
  USDC = 'usdc',
}

/**
 * Buy component events
 */
export enum BuyEvent {
  BuyFailure = 'buyFailure',
  BuyInitiated = 'buyInitiated',
  BuyOptionSelected = 'buyOptionSelected',
  BuySuccess = 'buySuccess',
  BuyCanceled = 'buyCanceled',
}

/**
 * Checkout component events
 */
export enum CheckoutEvent {
  CheckoutFailure = 'checkoutFailure',
  CheckoutInitiated = 'checkoutInitiated',
  CheckoutSuccess = 'checkoutSuccess',
  CheckoutCanceled = 'checkoutCanceled',
}

/**
 * Mint component events
 */
export enum MintEvent {
  MintFailure = 'mintFailure',
  MintInitiated = 'mintInitiated',
  MintQuantityChanged = 'mintQuantityChanged',
  MintSuccess = 'mintSuccess',
  MintCanceled = 'mintCanceled',
}

/**
 * Transaction component events
 */
export enum TransactionEvent {
  TransactionFailure = 'transactionFailure',
  TransactionInitiated = 'transactionInitiated',
  TransactionSuccess = 'transactionSuccess',
  TransactionCanceled = 'transactionCanceled',
}

/**
 * Fund component events
 */
export enum FundEvent {
  FundAmountChanged = 'fundAmountChanged',
  FundFailure = 'fundFailure',
  FundInitiated = 'fundInitiated',
  FundOptionSelected = 'fundOptionSelected',
  FundSuccess = 'fundSuccess',
  FundCanceled = 'fundCanceled',
}

/**
 * Earn component events
 */
export enum EarnEvent {
  EarnDepositInitiated = 'earnDepositInitiated',
  EarnDepositSuccess = 'earnDepositSuccess',
  EarnDepositFailure = 'earnDepositFailure',
  EarnDepositCanceled = 'earnDepositCanceled',
  EarnWithdrawInitiated = 'earnWithdrawInitiated',
  EarnWithdrawSuccess = 'earnWithdrawSuccess',
  EarnWithdrawFailure = 'earnWithdrawFailure',
  EarnWithdrawCanceled = 'earnWithdrawCanceled',
}

/**
 * Appchain component events
 */
export enum AppchainEvent {
  AppchainBridgeDepositInitiated = 'appchainBridgeDepositInitiated',
  AppchainBridgeDepositSuccess = 'appchainBridgeDepositSuccess',
  AppchainBridgeDepositFailure = 'appchainBridgeDepositFailure',
  AppchainBridgeWithdrawInitiated = 'appchainBridgeWithdrawInitiated',
  AppchainBridgeWithdrawSuccess = 'appchainBridgeWithdrawSuccess',
  AppchainBridgeWithdrawFailure = 'appchainBridgeWithdrawFailure',
  AppchainBridgeWaitForClaimFailure = 'appchainBridgeWaitForClaimFailure',
  AppchainBridgeClaimSuccess = 'appchainBridgeClaimSuccess',
  AppchainBridgeClaimFailure = 'appchainBridgeClaimFailure',
}

/**
 * Generic error events across components
 * Used for error tracking and monitoring
 */
export enum ErrorEvent {
  ComponentError = 'componentError',
}

/**
 * Analytics event types
 * Combines all possible event types
 */
export type AnalyticsEvent =
  | AppchainEvent
  | WalletEvent
  | SwapEvent
  | BuyEvent
  | CheckoutEvent
  | MintEvent
  | TransactionEvent
  | FundEvent
  | EarnEvent
  | ErrorEvent;

/**
 * Common analytics data included in all events
 * Provides basic context for every tracked event
 */
export type CommonAnalyticsData = {
  /** Unique identifier for user session */
  sessionId?: string;
  timestamp?: number;
};

export type AppchainEventData = {
  [AppchainEvent.AppchainBridgeDepositInitiated]: CommonAnalyticsData & {
    amount: string;
    tokenAddress: string;
    recipient: string;
  };
  [AppchainEvent.AppchainBridgeDepositSuccess]: CommonAnalyticsData & {
    amount: string;
    tokenAddress: string;
    recipient: string;
  };
  [AppchainEvent.AppchainBridgeDepositFailure]: CommonAnalyticsData & {
    error: string;
  };
  [AppchainEvent.AppchainBridgeWithdrawInitiated]: CommonAnalyticsData & {
    amount: string;
    tokenAddress: string;
    recipient: string;
  };
  [AppchainEvent.AppchainBridgeWithdrawSuccess]: CommonAnalyticsData & {
    amount: string;
    tokenAddress: string;
    recipient: string;
  };
  [AppchainEvent.AppchainBridgeWithdrawFailure]: CommonAnalyticsData & {
    error: string;
  };
  [AppchainEvent.AppchainBridgeWaitForClaimFailure]: CommonAnalyticsData & {
    transactionHash: Hex;
  };
  [AppchainEvent.AppchainBridgeClaimSuccess]: CommonAnalyticsData & {
    amount: string;
    tokenAddress: string;
  };
  [AppchainEvent.AppchainBridgeClaimFailure]: CommonAnalyticsData & {
    error: string;
  };
};

export type WalletEventData = {
  [WalletEvent.ConnectInitiated]: CommonAnalyticsData & {
    /** Component used to connect wallet */
    component: string;
  };
  [WalletEvent.ConnectError]: CommonAnalyticsData & {
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
  [WalletEvent.ConnectSuccess]: CommonAnalyticsData & {
    address: string;
    /** Coinbase, Metamask, Phantom, etc. */
    walletProvider: string;
  };
  [WalletEvent.Disconnect]: CommonAnalyticsData & {
    component: string;
    walletProvider: string;
  };
  [WalletEvent.OptionSelected]: CommonAnalyticsData & {
    option: WalletOption;
  };
  [WalletEvent.ConnectCanceled]: CommonAnalyticsData;
};

export type SwapEventData = {
  [SwapEvent.SlippageChanged]: CommonAnalyticsData & {
    previousSlippage: number;
    slippage: number;
  };
  [SwapEvent.TokenSelected]: CommonAnalyticsData & {
    token: string;
  };
  [SwapEvent.SwapSuccess]: CommonAnalyticsData & {
    paymaster: boolean;
    transactionHash: string;
    address: string;
    amount: number;
    from: string;
    to: string;
  };
  [SwapEvent.SwapFailure]: CommonAnalyticsData & {
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
  [SwapEvent.SwapInitiated]: CommonAnalyticsData & {
    amount: number;
  };
  [SwapEvent.SwapCanceled]: CommonAnalyticsData;
};

export type BuyEventData = {
  [BuyEvent.BuyFailure]: CommonAnalyticsData & {
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
  [BuyEvent.BuyInitiated]: CommonAnalyticsData & {
    amount: number | undefined;
    token: string | undefined;
  };
  [BuyEvent.BuyOptionSelected]: CommonAnalyticsData & {
    option: BuyOption | undefined;
  };
  [BuyEvent.BuySuccess]: CommonAnalyticsData & {
    address: string | undefined;
    amount: number | undefined;
    from: string | undefined;
    paymaster: boolean | undefined;
    to: string | undefined;
    transactionHash: string | undefined;
  };
  [BuyEvent.BuyCanceled]: CommonAnalyticsData;
};

/**
 * Checkout component events data
 */
export type CheckoutEventData = {
  [CheckoutEvent.CheckoutSuccess]: CommonAnalyticsData & {
    chargeHandlerId: string;
    transactionHash: string | undefined;
  };
  [CheckoutEvent.CheckoutFailure]: CommonAnalyticsData & {
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
  [CheckoutEvent.CheckoutInitiated]: CommonAnalyticsData & {
    address: string | undefined;
    amount: number;
    productId: string;
  };
  [CheckoutEvent.CheckoutCanceled]: CommonAnalyticsData;
};

/**
 * Mint component events data
 */
export type MintEventData = {
  [MintEvent.MintFailure]: CommonAnalyticsData & {
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
  [MintEvent.MintInitiated]: CommonAnalyticsData & {
    contractAddress: string;
    quantity: number;
    tokenId: string;
  };
  [MintEvent.MintQuantityChanged]: CommonAnalyticsData & {
    quantity: number;
  };
  [MintEvent.MintSuccess]: CommonAnalyticsData & {
    address: string;
    amountMinted: number;
    contractAddress: string;
    isSponsored: boolean;
    tokenId: string;
  };
  [MintEvent.MintCanceled]: CommonAnalyticsData;
};

/**
 * Transaction component events data
 */
export type TransactionEventData = {
  [TransactionEvent.TransactionFailure]: CommonAnalyticsData & {
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
  [TransactionEvent.TransactionInitiated]: CommonAnalyticsData & {
    address: string | undefined;
  };
  [TransactionEvent.TransactionSuccess]: CommonAnalyticsData & {
    paymaster: boolean | undefined;
    address: string | undefined;
    transactionHash: string | undefined;
  };
  [TransactionEvent.TransactionCanceled]: CommonAnalyticsData;
};

/**
 * Fund component events data
 */
export type FundEventData = {
  [FundEvent.FundAmountChanged]: CommonAnalyticsData & {
    amount: number;
    currency: string;
  };
  [FundEvent.FundFailure]: CommonAnalyticsData & {
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
  [FundEvent.FundInitiated]: CommonAnalyticsData & {
    currency: string;
  };
  [FundEvent.FundOptionSelected]: CommonAnalyticsData & {
    option: string;
  };
  [FundEvent.FundSuccess]: CommonAnalyticsData & {
    address: string;
    amount: number;
    currency: string;
    transactionHash: string;
  };
  [FundEvent.FundCanceled]: CommonAnalyticsData;
};

/**
 * Earn component events data
 */
export type EarnEventData = {
  [EarnEvent.EarnDepositInitiated]: CommonAnalyticsData & {
    amount: number;
    address: string;
    tokenAddress: string;
    vaultAddress: string;
  };
  [EarnEvent.EarnDepositSuccess]: CommonAnalyticsData & {
    amount: number;
    address: string;
    tokenAddress: string;
    vaultAddress: string;
  };
  [EarnEvent.EarnDepositFailure]: CommonAnalyticsData & {
    amount: number;
    address: string;
    tokenAddress: string;
    vaultAddress: string;
  };
  [EarnEvent.EarnDepositCanceled]: CommonAnalyticsData;
  [EarnEvent.EarnWithdrawInitiated]: CommonAnalyticsData & {
    amount: number;
    address: string;
    tokenAddress: string;
    vaultAddress: string;
  };
  [EarnEvent.EarnWithdrawSuccess]: CommonAnalyticsData & {
    amount: number;
    address: string;
    tokenAddress: string;
    vaultAddress: string;
  };
  [EarnEvent.EarnWithdrawFailure]: CommonAnalyticsData & {
    amount: number;
    address: string;
    tokenAddress: string;
    vaultAddress: string;
  };
  [EarnEvent.EarnWithdrawCanceled]: CommonAnalyticsData;
};

// Update main AnalyticsEventData type to include all component events
export type AnalyticsEventData = {
  // Appchain events
  [AppchainEvent.AppchainBridgeDepositInitiated]: AppchainEventData[AppchainEvent.AppchainBridgeDepositInitiated];
  [AppchainEvent.AppchainBridgeDepositSuccess]: AppchainEventData[AppchainEvent.AppchainBridgeDepositSuccess];
  [AppchainEvent.AppchainBridgeDepositFailure]: AppchainEventData[AppchainEvent.AppchainBridgeDepositFailure];
  [AppchainEvent.AppchainBridgeWithdrawInitiated]: AppchainEventData[AppchainEvent.AppchainBridgeWithdrawInitiated];
  [AppchainEvent.AppchainBridgeWithdrawSuccess]: AppchainEventData[AppchainEvent.AppchainBridgeWithdrawSuccess];
  [AppchainEvent.AppchainBridgeWithdrawFailure]: AppchainEventData[AppchainEvent.AppchainBridgeWithdrawFailure];
  [AppchainEvent.AppchainBridgeWaitForClaimFailure]: AppchainEventData[AppchainEvent.AppchainBridgeWaitForClaimFailure];
  [AppchainEvent.AppchainBridgeClaimSuccess]: AppchainEventData[AppchainEvent.AppchainBridgeClaimSuccess];
  [AppchainEvent.AppchainBridgeClaimFailure]: AppchainEventData[AppchainEvent.AppchainBridgeClaimFailure];

  // Wallet events
  [WalletEvent.ConnectError]: WalletEventData[WalletEvent.ConnectError];
  [WalletEvent.ConnectInitiated]: WalletEventData[WalletEvent.ConnectInitiated];
  [WalletEvent.ConnectSuccess]: WalletEventData[WalletEvent.ConnectSuccess];
  [WalletEvent.Disconnect]: WalletEventData[WalletEvent.Disconnect];
  [WalletEvent.OptionSelected]: CommonAnalyticsData & {
    option: WalletOption;
  };
  [WalletEvent.ConnectCanceled]: WalletEventData[WalletEvent.ConnectCanceled];

  // Swap events
  [SwapEvent.SlippageChanged]: SwapEventData[SwapEvent.SlippageChanged];
  [SwapEvent.TokenSelected]: SwapEventData[SwapEvent.TokenSelected];
  [SwapEvent.SwapSuccess]: SwapEventData[SwapEvent.SwapSuccess];
  [SwapEvent.SwapFailure]: SwapEventData[SwapEvent.SwapFailure];
  [SwapEvent.SwapInitiated]: SwapEventData[SwapEvent.SwapInitiated];
  [SwapEvent.SwapCanceled]: SwapEventData[SwapEvent.SwapCanceled];

  // Buy events
  [BuyEvent.BuyFailure]: BuyEventData[BuyEvent.BuyFailure];
  [BuyEvent.BuyInitiated]: BuyEventData[BuyEvent.BuyInitiated];
  [BuyEvent.BuyOptionSelected]: BuyEventData[BuyEvent.BuyOptionSelected];
  [BuyEvent.BuySuccess]: BuyEventData[BuyEvent.BuySuccess];
  [BuyEvent.BuyCanceled]: BuyEventData[BuyEvent.BuyCanceled];

  // Checkout events
  [CheckoutEvent.CheckoutFailure]: CheckoutEventData[CheckoutEvent.CheckoutFailure];
  [CheckoutEvent.CheckoutInitiated]: CheckoutEventData[CheckoutEvent.CheckoutInitiated];
  [CheckoutEvent.CheckoutSuccess]: CheckoutEventData[CheckoutEvent.CheckoutSuccess];
  [CheckoutEvent.CheckoutCanceled]: CheckoutEventData[CheckoutEvent.CheckoutCanceled];

  // Mint events
  [MintEvent.MintFailure]: MintEventData[MintEvent.MintFailure];
  [MintEvent.MintInitiated]: MintEventData[MintEvent.MintInitiated];
  [MintEvent.MintQuantityChanged]: MintEventData[MintEvent.MintQuantityChanged];
  [MintEvent.MintSuccess]: MintEventData[MintEvent.MintSuccess];
  [MintEvent.MintCanceled]: MintEventData[MintEvent.MintCanceled];

  // Transaction events
  [TransactionEvent.TransactionFailure]: TransactionEventData[TransactionEvent.TransactionFailure];
  [TransactionEvent.TransactionInitiated]: TransactionEventData[TransactionEvent.TransactionInitiated];
  [TransactionEvent.TransactionSuccess]: TransactionEventData[TransactionEvent.TransactionSuccess];
  [TransactionEvent.TransactionCanceled]: TransactionEventData[TransactionEvent.TransactionCanceled];

  // Fund events
  [FundEvent.FundAmountChanged]: FundEventData[FundEvent.FundAmountChanged];
  [FundEvent.FundFailure]: FundEventData[FundEvent.FundFailure];
  [FundEvent.FundInitiated]: FundEventData[FundEvent.FundInitiated];
  [FundEvent.FundOptionSelected]: FundEventData[FundEvent.FundOptionSelected];
  [FundEvent.FundSuccess]: FundEventData[FundEvent.FundSuccess];
  [FundEvent.FundCanceled]: FundEventData[FundEvent.FundCanceled];

  // Earn events
  [EarnEvent.EarnDepositInitiated]: EarnEventData[EarnEvent.EarnDepositInitiated];
  [EarnEvent.EarnDepositSuccess]: EarnEventData[EarnEvent.EarnDepositSuccess];
  [EarnEvent.EarnDepositFailure]: EarnEventData[EarnEvent.EarnDepositFailure];
  [EarnEvent.EarnDepositCanceled]: EarnEventData[EarnEvent.EarnDepositCanceled];
  [EarnEvent.EarnWithdrawInitiated]: EarnEventData[EarnEvent.EarnWithdrawInitiated];
  [EarnEvent.EarnWithdrawSuccess]: EarnEventData[EarnEvent.EarnWithdrawSuccess];
  [EarnEvent.EarnWithdrawFailure]: EarnEventData[EarnEvent.EarnWithdrawFailure];
  [EarnEvent.EarnWithdrawCanceled]: EarnEventData[EarnEvent.EarnWithdrawCanceled];

  // Error events
  [ErrorEvent.ComponentError]: CommonAnalyticsData & {
    component: string;
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
};
