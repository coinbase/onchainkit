import type { Hex } from 'viem';

/**
 * Wallet component events - Tracks all possible wallet interaction states
 * Used to monitor wallet connection flow and user interactions
 */
export const WalletEvent = {
  /** Wallet connection fails */
  ConnectError: 'walletConnectError',
  /** User clicks connect wallet button */
  ConnectInitiated: 'walletConnectInitiated',
  /** Wallet successfully connected */
  ConnectSuccess: 'walletConnectSuccess',
  /** User disconnects wallet */
  Disconnect: 'walletDisconnect',
  /** User selects a wallet option */
  OptionSelected: 'walletOptionSelected',
  /** User cancels wallet connection */
  ConnectCanceled: 'walletConnectCanceled',
} as const;

export type WalletEventType = (typeof WalletEvent)[keyof typeof WalletEvent];

/**
 * Wallet option - Available actions in the wallet interface
 * Used to track which wallet features users interact with
 */
export const WalletOption = {
  Buy: 'buy',
  Explorer: 'explorer',
  QR: 'qr',
  Refresh: 'refresh',
  Send: 'send',
  Swap: 'swap',
} as const;
export type WalletOptionType = (typeof WalletOption)[keyof typeof WalletOption];

/**
 * Swap component events
 */
export const SwapEvent = {
  SlippageChanged: 'swapSlippageChanged',
  TokenSelected: 'swapTokenSelected',
  SwapSuccess: 'swapSuccess',
  SwapInitiated: 'swapInitiated',
  SwapFailure: 'swapFailure',
  SwapCanceled: 'swapCanceled',
} as const;
export type SwapEventType = (typeof SwapEvent)[keyof typeof SwapEvent];

/**
 * Buy option - Available payment methods for buying
 * Used to track which payment method users select
 */
export const BuyOption = {
  APPLE_PAY: 'apple_pay',
  COINBASE: 'coinbase_account',
  DEBIT_CARD: 'debit_card',
  ETH: 'eth',
  USDC: 'usdc',
} as const;
export type BuyOptionType = (typeof BuyOption)[keyof typeof BuyOption];
/**
 * Buy component events
 */
export const BuyEvent = {
  BuyFailure: 'buyFailure',
  BuyInitiated: 'buyInitiated',
  BuyOptionSelected: 'buyOptionSelected',
  BuySuccess: 'buySuccess',
  BuyCanceled: 'buyCanceled',
} as const;
export type BuyEventType = (typeof BuyEvent)[keyof typeof BuyEvent];
/**
 * Checkout component events
 */
export const CheckoutEvent = {
  CheckoutFailure: 'checkoutFailure',
  CheckoutInitiated: 'checkoutInitiated',
  CheckoutSuccess: 'checkoutSuccess',
  CheckoutCanceled: 'checkoutCanceled',
} as const;
export type CheckoutEventType =
  (typeof CheckoutEvent)[keyof typeof CheckoutEvent];

/**
 * Mint component events
 */
export const MintEvent = {
  MintFailure: 'mintFailure',
  MintInitiated: 'mintInitiated',
  MintQuantityChanged: 'mintQuantityChanged',
  MintSuccess: 'mintSuccess',
  MintCanceled: 'mintCanceled',
} as const;
export type MintEventType = (typeof MintEvent)[keyof typeof MintEvent];

/**
 * Transaction component events
 */
export const TransactionEvent = {
  TransactionFailure: 'transactionFailure',
  TransactionInitiated: 'transactionInitiated',
  TransactionSuccess: 'transactionSuccess',
  TransactionCanceled: 'transactionCanceled',
} as const;
export type TransactionEventType =
  (typeof TransactionEvent)[keyof typeof TransactionEvent];

/**
 * Fund component events
 */
export const FundEvent = {
  FundAmountChanged: 'fundAmountChanged',
  FundFailure: 'fundFailure',
  FundInitiated: 'fundInitiated',
  FundOptionSelected: 'fundOptionSelected',
  FundSuccess: 'fundSuccess',
  FundCanceled: 'fundCanceled',
} as const;
export type FundEventType = (typeof FundEvent)[keyof typeof FundEvent];

/**
 * Earn component events
 */
export const EarnEvent = {
  EarnDepositInitiated: 'earnDepositInitiated',
  EarnDepositSuccess: 'earnDepositSuccess',
  EarnDepositFailure: 'earnDepositFailure',
  EarnDepositCanceled: 'earnDepositCanceled',
  EarnWithdrawInitiated: 'earnWithdrawInitiated',
  EarnWithdrawSuccess: 'earnWithdrawSuccess',
  EarnWithdrawFailure: 'earnWithdrawFailure',
  EarnWithdrawCanceled: 'earnWithdrawCanceled',
} as const;
export type EarnEventType = (typeof EarnEvent)[keyof typeof EarnEvent];

/**
 * Appchain component events
 */
export const AppchainEvent = {
  AppchainBridgeDepositInitiated: 'appchainBridgeDepositInitiated',
  AppchainBridgeDepositSuccess: 'appchainBridgeDepositSuccess',
  AppchainBridgeDepositFailure: 'appchainBridgeDepositFailure',
  AppchainBridgeWithdrawInitiated: 'appchainBridgeWithdrawInitiated',
  AppchainBridgeWithdrawSuccess: 'appchainBridgeWithdrawSuccess',
  AppchainBridgeWithdrawFailure: 'appchainBridgeWithdrawFailure',
  AppchainBridgeWaitForClaimFailure: 'appchainBridgeWaitForClaimFailure',
  AppchainBridgeClaimSuccess: 'appchainBridgeClaimSuccess',
  AppchainBridgeClaimFailure: 'appchainBridgeClaimFailure',
} as const;
export type AppchainEventType =
  (typeof AppchainEvent)[keyof typeof AppchainEvent];

/**
 * Generic error events across components
 * Used for error tracking and monitoring
 */
export const ErrorEvent = {
  ComponentError: 'componentError',
} as const;
export type ErrorEventType = (typeof ErrorEvent)[keyof typeof ErrorEvent];

/**
 * Analytics event types
 * Combines all possible event types
 */
export type AnalyticsEvent =
  | AppchainEventType
  | WalletEventType
  | SwapEventType
  | BuyEventType
  | CheckoutEventType
  | MintEventType
  | TransactionEventType
  | FundEventType
  | EarnEventType
  | ErrorEventType;

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
    option: WalletOptionType;
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
    option: BuyOptionType | undefined;
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
  [AppchainEvent.AppchainBridgeDepositInitiated]: AppchainEventData[typeof AppchainEvent.AppchainBridgeDepositInitiated];
  [AppchainEvent.AppchainBridgeDepositSuccess]: AppchainEventData[typeof AppchainEvent.AppchainBridgeDepositSuccess];
  [AppchainEvent.AppchainBridgeDepositFailure]: AppchainEventData[typeof AppchainEvent.AppchainBridgeDepositFailure];
  [AppchainEvent.AppchainBridgeWithdrawInitiated]: AppchainEventData[typeof AppchainEvent.AppchainBridgeWithdrawInitiated];
  [AppchainEvent.AppchainBridgeWithdrawSuccess]: AppchainEventData[typeof AppchainEvent.AppchainBridgeWithdrawSuccess];
  [AppchainEvent.AppchainBridgeWithdrawFailure]: AppchainEventData[typeof AppchainEvent.AppchainBridgeWithdrawFailure];
  [AppchainEvent.AppchainBridgeWaitForClaimFailure]: AppchainEventData[typeof AppchainEvent.AppchainBridgeWaitForClaimFailure];
  [AppchainEvent.AppchainBridgeClaimSuccess]: AppchainEventData[typeof AppchainEvent.AppchainBridgeClaimSuccess];
  [AppchainEvent.AppchainBridgeClaimFailure]: AppchainEventData[typeof AppchainEvent.AppchainBridgeClaimFailure];

  // Wallet events
  [WalletEvent.ConnectError]: WalletEventData[typeof WalletEvent.ConnectError];
  [WalletEvent.ConnectInitiated]: WalletEventData[typeof WalletEvent.ConnectInitiated];
  [WalletEvent.ConnectSuccess]: WalletEventData[typeof WalletEvent.ConnectSuccess];
  [WalletEvent.Disconnect]: WalletEventData[typeof WalletEvent.Disconnect];
  [WalletEvent.OptionSelected]: WalletEventData[typeof WalletEvent.OptionSelected];
  [WalletEvent.ConnectCanceled]: WalletEventData[typeof WalletEvent.ConnectCanceled];

  // Swap events
  [SwapEvent.SlippageChanged]: SwapEventData[typeof SwapEvent.SlippageChanged];
  [SwapEvent.TokenSelected]: SwapEventData[typeof SwapEvent.TokenSelected];
  [SwapEvent.SwapSuccess]: SwapEventData[typeof SwapEvent.SwapSuccess];
  [SwapEvent.SwapFailure]: SwapEventData[typeof SwapEvent.SwapFailure];
  [SwapEvent.SwapInitiated]: SwapEventData[typeof SwapEvent.SwapInitiated];
  [SwapEvent.SwapCanceled]: SwapEventData[typeof SwapEvent.SwapCanceled];

  // Buy events
  [BuyEvent.BuyFailure]: BuyEventData[typeof BuyEvent.BuyFailure];
  [BuyEvent.BuyInitiated]: BuyEventData[typeof BuyEvent.BuyInitiated];
  [BuyEvent.BuyOptionSelected]: BuyEventData[typeof BuyEvent.BuyOptionSelected];
  [BuyEvent.BuySuccess]: BuyEventData[typeof BuyEvent.BuySuccess];
  [BuyEvent.BuyCanceled]: BuyEventData[typeof BuyEvent.BuyCanceled];

  // Checkout events
  [CheckoutEvent.CheckoutFailure]: CheckoutEventData[typeof CheckoutEvent.CheckoutFailure];
  [CheckoutEvent.CheckoutInitiated]: CheckoutEventData[typeof CheckoutEvent.CheckoutInitiated];
  [CheckoutEvent.CheckoutSuccess]: CheckoutEventData[typeof CheckoutEvent.CheckoutSuccess];
  [CheckoutEvent.CheckoutCanceled]: CheckoutEventData[typeof CheckoutEvent.CheckoutCanceled];

  // Mint events
  [MintEvent.MintFailure]: MintEventData[typeof MintEvent.MintFailure];
  [MintEvent.MintInitiated]: MintEventData[typeof MintEvent.MintInitiated];
  [MintEvent.MintQuantityChanged]: MintEventData[typeof MintEvent.MintQuantityChanged];
  [MintEvent.MintSuccess]: MintEventData[typeof MintEvent.MintSuccess];
  [MintEvent.MintCanceled]: MintEventData[typeof MintEvent.MintCanceled];

  // Transaction events
  [TransactionEvent.TransactionFailure]: TransactionEventData[typeof TransactionEvent.TransactionFailure];
  [TransactionEvent.TransactionInitiated]: TransactionEventData[typeof TransactionEvent.TransactionInitiated];
  [TransactionEvent.TransactionSuccess]: TransactionEventData[typeof TransactionEvent.TransactionSuccess];
  [TransactionEvent.TransactionCanceled]: TransactionEventData[typeof TransactionEvent.TransactionCanceled];

  // Fund events
  [FundEvent.FundAmountChanged]: FundEventData[typeof FundEvent.FundAmountChanged];
  [FundEvent.FundFailure]: FundEventData[typeof FundEvent.FundFailure];
  [FundEvent.FundInitiated]: FundEventData[typeof FundEvent.FundInitiated];
  [FundEvent.FundOptionSelected]: FundEventData[typeof FundEvent.FundOptionSelected];
  [FundEvent.FundSuccess]: FundEventData[typeof FundEvent.FundSuccess];
  [FundEvent.FundCanceled]: FundEventData[typeof FundEvent.FundCanceled];

  // Earn events
  [EarnEvent.EarnDepositInitiated]: EarnEventData[typeof EarnEvent.EarnDepositInitiated];
  [EarnEvent.EarnDepositSuccess]: EarnEventData[typeof EarnEvent.EarnDepositSuccess];
  [EarnEvent.EarnDepositFailure]: EarnEventData[typeof EarnEvent.EarnDepositFailure];
  [EarnEvent.EarnDepositCanceled]: EarnEventData[typeof EarnEvent.EarnDepositCanceled];
  [EarnEvent.EarnWithdrawInitiated]: EarnEventData[typeof EarnEvent.EarnWithdrawInitiated];
  [EarnEvent.EarnWithdrawSuccess]: EarnEventData[typeof EarnEvent.EarnWithdrawSuccess];
  [EarnEvent.EarnWithdrawFailure]: EarnEventData[typeof EarnEvent.EarnWithdrawFailure];
  [EarnEvent.EarnWithdrawCanceled]: EarnEventData[typeof EarnEvent.EarnWithdrawCanceled];

  // Error events
  [ErrorEvent.ComponentError]: CommonAnalyticsData & {
    component: string;
    error: string;
    metadata: Record<string, unknown> | undefined;
  };
};
