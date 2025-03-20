export const ANALYTICS_API_URL = 'https://api.developer.coinbase.com/analytics';

/**
 * Analytics event names
 */
export const ANALYTICS_EVENTS = {
  // Appchain events
  APPCHAIN_BRIDGE_DEPOSIT_INITIATED: 'appchainBridgeDepositInitiated',
  APPCHAIN_BRIDGE_DEPOSIT_SUCCESS: 'appchainBridgeDepositSuccess',
  APPCHAIN_BRIDGE_DEPOSIT_FAILURE: 'appchainBridgeDepositFailure',
  APPCHAIN_BRIDGE_WITHDRAW_INITIATED: 'appchainBridgeWithdrawInitiated',
  APPCHAIN_BRIDGE_WITHDRAW_SUCCESS: 'appchainBridgeWithdrawSuccess',
  APPCHAIN_BRIDGE_WITHDRAW_FAILURE: 'appchainBridgeWithdrawFailure',
  APPCHAIN_BRIDGE_WAIT_FOR_CLAIM_FAILURE: 'appchainBridgeWaitForClaimFailure',
  APPCHAIN_BRIDGE_CLAIM_SUCCESS: 'appchainBridgeClaimSuccess',
  APPCHAIN_BRIDGE_CLAIM_FAILURE: 'appchainBridgeClaimFailure',

  // Buy events
  BUY_FAILURE: 'buyFailure',
  BUY_INITIATED: 'buyInitiated',
  BUY_OPTION_SELECTED: 'buyOptionSelected',
  BUY_SUCCESS: 'buySuccess',
  BUY_CANCELED: 'buyCanceled',

  // Checkout events
  CHECKOUT_FAILURE: 'checkoutFailure',
  CHECKOUT_INITIATED: 'checkoutInitiated',
  CHECKOUT_SUCCESS: 'checkoutSuccess',
  CHECKOUT_CANCELED: 'checkoutCanceled',

  // Error events
  COMPONENT_ERROR: 'componentError',

  // Fund events
  FUND_AMOUNT_CHANGED: 'fundAmountChanged',
  FUND_FAILURE: 'fundFailure',
  FUND_INITIATED: 'fundInitiated',
  FUND_OPTION_SELECTED: 'fundOptionSelected',
  FUND_SUCCESS: 'fundSuccess',
  FUND_CANCELED: 'fundCanceled',

  // Mint events
  MINT_FAILURE: 'mintFailure',
  MINT_INITIATED: 'mintInitiated',
  MINT_QUANTITY_CHANGED: 'mintQuantityChanged',
  MINT_SUCCESS: 'mintSuccess',
  MINT_CANCELED: 'mintCanceled',

  // Swap events
  SWAP_FAILURE: 'swapFailure',
  SWAP_INITIATED: 'swapInitiated',
  SWAP_SLIPPAGE_CHANGED: 'swapSlippageChanged',
  SWAP_SUCCESS: 'swapSuccess',
  SWAP_TOKEN_SELECTED: 'swapTokenSelected',
  SWAP_CANCELED: 'swapCanceled',

  // Transaction events
  TRANSACTION_FAILURE: 'transactionFailure',
  TRANSACTION_INITIATED: 'transactionInitiated',
  TRANSACTION_SUCCESS: 'transactionSuccess',
  TRANSACTION_CANCELED: 'transactionCanceled',

  // Wallet events
  WALLET_CONNECT_ERROR: 'walletConnectError',
  WALLET_CONNECT_INITIATED: 'walletConnectInitiated',
  WALLET_CONNECT_SUCCESS: 'walletConnectSuccess',
  WALLET_DISCONNECT: 'walletDisconnect',
  WALLET_OPTION_SELECTED: 'walletOptionSelected',
  WALLET_CONNECT_CANCELED: 'walletConnectCanceled',

  // Earn events
  EARN_DEPOSIT_INITIATED: 'earnDepositInitiated',
  EARN_DEPOSIT_SUCCESS: 'earnDepositSuccess',
  EARN_DEPOSIT_FAILURE: 'earnDepositFailure',
  EARN_DEPOSIT_CANCELED: 'earnDepositCanceled',
  EARN_WITHDRAW_INITIATED: 'earnWithdrawInitiated',
  EARN_WITHDRAW_SUCCESS: 'earnWithdrawSuccess',
  EARN_WITHDRAW_FAILURE: 'earnWithdrawFailure',
  EARN_WITHDRAW_CANCELED: 'earnWithdrawCanceled',
} as const;

/**
 * Component names for error tracking
 */
export const COMPONENT_NAMES = {
  BUY: 'buy',
  CHECKOUT: 'checkout',
  FUND: 'fund',
  MINT: 'mint',
  SWAP: 'swap',
  TRANSACTION: 'transaction',
  WALLET: 'wallet',
  EARN: 'earn',
} as const;

/**
 * Buy options
 */
export const BUY_OPTIONS = {
  APPLE_PAY: 'apple_pay',
  COINBASE: 'coinbase_account',
  DEBIT_CARD: 'debit_card',
  ETH: 'eth',
  USDC: 'usdc',
} as const;

/**
 * Fund options
 */
export const FUND_OPTIONS = {
  APPLE_PAY: 'apple_pay',
  COINBASE: 'coinbase_account',
  DEBIT_CARD: 'debit_card',
} as const;
