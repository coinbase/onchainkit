/**
 * Component-specific events
 */

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
  TokenDropdownSelected = 'tokenDropdownSelected',
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
}

/**
 * Checkout component events
 */
export enum CheckoutEvent {
  CheckoutFailure = 'checkoutFailure',
  CheckoutInitiated = 'checkoutInitiated',
  CheckoutSuccess = 'checkoutSuccess',
}

/**
 * Mint component events
 */
export enum MintEvent {
  MintFailure = 'mintFailure',
  MintInitiated = 'mintInitiated',
  MintQuantityChanged = 'mintQuantityChanged',
  MintSuccess = 'mintSuccess',
}

/**
 * Transaction component events
 */
export enum TransactionEvent {
  TransactionFailure = 'transactionFailure',
  TransactionInitiated = 'transactionInitiated',
  TransactionSuccess = 'transactionSuccess',
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
  | WalletEvent
  | SwapEvent
  | BuyEvent
  | CheckoutEvent
  | MintEvent
  | TransactionEvent
  | FundEvent
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

export type WalletEventData = {
  [WalletEvent.ConnectInitiated]: CommonAnalyticsData & {
    /** Component used to connect wallet */
    component: string;
    /** Coinbase, Metamask, Phantom, etc. */
    walletProvider: string;
  };
  [WalletEvent.ConnectError]: CommonAnalyticsData & {
    error: string;
    metadata?: Record<string, unknown>;
  };
  [WalletEvent.ConnectSuccess]: CommonAnalyticsData & {
    address: string;
    walletProvider: string;
  };
  [WalletEvent.Disconnect]: CommonAnalyticsData & {
    component: string;
    walletProvider: string;
  };
  [WalletEvent.OptionSelected]: CommonAnalyticsData & {
    option: WalletOption;
  };
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
    metadata?: Record<string, unknown>;
  };
  [SwapEvent.TokenDropdownSelected]: CommonAnalyticsData & {
    position: 'from' | 'to';
  };
  [SwapEvent.SwapInitiated]: CommonAnalyticsData & {
    amount: number;
    from: string;
    to: string;
  };
};

export type BuyEventData = {
  [BuyEvent.BuyFailure]: CommonAnalyticsData & {
    error: string;
    metadata?: Record<string, unknown>;
  };
  [BuyEvent.BuyInitiated]: CommonAnalyticsData & {
    amount: number;
    token: string;
  };
  [BuyEvent.BuyOptionSelected]: CommonAnalyticsData & {
    option: BuyOption;
  };
  [BuyEvent.BuySuccess]: CommonAnalyticsData & {
    address: string;
    amount: number;
    from: string;
    paymaster: boolean;
    to: string;
    transactionHash: string;
  };
};

/**
 * Checkout component events data
 */
export type CheckoutEventData = {
  [CheckoutEvent.CheckoutSuccess]: CommonAnalyticsData & {
    address: string;
    amount: number;
    productId: string;
    chargeHandlerId: string;
    isSponsored: boolean;
    transactionHash?: string;
  };
  [CheckoutEvent.CheckoutFailure]: CommonAnalyticsData & {
    error: string;
    metadata?: Record<string, unknown>;
  };
  [CheckoutEvent.CheckoutInitiated]: CommonAnalyticsData & {
    amount: number;
    productId: string;
    chargeHandlerId: string;
  };
};

/**
 * Mint component events data
 */
export type MintEventData = {
  [MintEvent.MintFailure]: CommonAnalyticsData & {
    error: string;
    metadata?: Record<string, unknown>;
  };
  [MintEvent.MintInitiated]: CommonAnalyticsData & {
    contractAddress: string;
    quantity: number;
    tokenId: string;
  };
  [MintEvent.MintQuantityChanged]: CommonAnalyticsData & {
    quantity: number;
    previousQuantity: number;
  };
  [MintEvent.MintSuccess]: CommonAnalyticsData & {
    address: string;
    amountMinted: number;
    contractAddress: string;
    isSponsored: boolean;
    tokenId: string;
  };
};

/**
 * Transaction component events data
 */
export type TransactionEventData = {
  [TransactionEvent.TransactionFailure]: CommonAnalyticsData & {
    error: string;
    contracts: Array<{
      contractAddress: string;
      function: string;
    }>;
    metadata?: Record<string, unknown>;
  };
  [TransactionEvent.TransactionInitiated]: CommonAnalyticsData & {
    address: string;
    contracts: Array<{
      contractAddress: string;
      function: string;
    }>;
  };
  [TransactionEvent.TransactionSuccess]: CommonAnalyticsData & {
    paymaster: boolean;
    address: string;
    contracts: Array<{
      contractAddress: string;
      function: string;
    }>;
    transactionHash: string;
  };
};

/**
 * Fund component events data
 */
export type FundEventData = {
  [FundEvent.FundAmountChanged]: CommonAnalyticsData & {
    amount: number;
    currency: string;
    previousAmount: number;
  };
  [FundEvent.FundFailure]: CommonAnalyticsData & {
    error: string;
    metadata?: Record<string, unknown>;
  };
  [FundEvent.FundInitiated]: CommonAnalyticsData & {
    amount: number;
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
};

// Update main AnalyticsEventData type to include all component events
export type AnalyticsEventData = {
  // Wallet events
  [WalletEvent.ConnectError]: WalletEventData[WalletEvent.ConnectError];
  [WalletEvent.ConnectInitiated]: WalletEventData[WalletEvent.ConnectInitiated];
  [WalletEvent.ConnectSuccess]: WalletEventData[WalletEvent.ConnectSuccess];
  [WalletEvent.Disconnect]: WalletEventData[WalletEvent.Disconnect];
  [WalletEvent.OptionSelected]: CommonAnalyticsData & {
    option: WalletOption;
  };

  // Swap events
  [SwapEvent.SlippageChanged]: SwapEventData[SwapEvent.SlippageChanged];
  [SwapEvent.TokenSelected]: SwapEventData[SwapEvent.TokenSelected];
  [SwapEvent.SwapSuccess]: SwapEventData[SwapEvent.SwapSuccess];
  [SwapEvent.SwapFailure]: SwapEventData[SwapEvent.SwapFailure];
  [SwapEvent.TokenDropdownSelected]: SwapEventData[SwapEvent.TokenDropdownSelected];
  [SwapEvent.SwapInitiated]: SwapEventData[SwapEvent.SwapInitiated];

  // Buy events
  [BuyEvent.BuyFailure]: BuyEventData[BuyEvent.BuyFailure];
  [BuyEvent.BuyInitiated]: BuyEventData[BuyEvent.BuyInitiated];
  [BuyEvent.BuyOptionSelected]: BuyEventData[BuyEvent.BuyOptionSelected];
  [BuyEvent.BuySuccess]: BuyEventData[BuyEvent.BuySuccess];

  // Checkout events
  [CheckoutEvent.CheckoutFailure]: CheckoutEventData[CheckoutEvent.CheckoutFailure];
  [CheckoutEvent.CheckoutInitiated]: CheckoutEventData[CheckoutEvent.CheckoutInitiated];
  [CheckoutEvent.CheckoutSuccess]: CheckoutEventData[CheckoutEvent.CheckoutSuccess];

  // Mint events
  [MintEvent.MintFailure]: MintEventData[MintEvent.MintFailure];
  [MintEvent.MintInitiated]: MintEventData[MintEvent.MintInitiated];
  [MintEvent.MintQuantityChanged]: MintEventData[MintEvent.MintQuantityChanged];
  [MintEvent.MintSuccess]: MintEventData[MintEvent.MintSuccess];

  // Transaction events
  [TransactionEvent.TransactionFailure]: TransactionEventData[TransactionEvent.TransactionFailure];
  [TransactionEvent.TransactionInitiated]: TransactionEventData[TransactionEvent.TransactionInitiated];
  [TransactionEvent.TransactionSuccess]: TransactionEventData[TransactionEvent.TransactionSuccess];

  // Fund events
  [FundEvent.FundAmountChanged]: FundEventData[FundEvent.FundAmountChanged];
  [FundEvent.FundFailure]: FundEventData[FundEvent.FundFailure];
  [FundEvent.FundInitiated]: FundEventData[FundEvent.FundInitiated];
  [FundEvent.FundOptionSelected]: FundEventData[FundEvent.FundOptionSelected];
  [FundEvent.FundSuccess]: FundEventData[FundEvent.FundSuccess];

  // Error events
  [ErrorEvent.ComponentError]: CommonAnalyticsData & {
    component: string;
    error: string;
    metadata?: Record<string, unknown>;
  };
};
