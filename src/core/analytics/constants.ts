export const ANALYTICS_API_URL = 'https://api.developer.coinbase.com/analytics';

/**
 * Analytics event names
 */
export const ANALYTICS_EVENTS = {
  // Buy events
  BUY_FAILURE: 'buyFailure',
  BUY_INITIATED: 'buyInitiated',
  BUY_OPTION_SELECTED: 'buyOptionSelected',
  BUY_SUCCESS: 'buySuccess',
  BUY_CANCELLED: 'buyCancelled',

  // Checkout events
  CHECKOUT_FAILURE: 'checkoutFailure',
  CHECKOUT_INITIATED: 'checkoutInitiated',
  CHECKOUT_SUCCESS: 'checkoutSuccess',
  CHECKOUT_CANCELLED: 'checkoutCancelled',

  // Error events
  COMPONENT_ERROR: 'componentError',

  // Fund events
  FUND_AMOUNT_CHANGED: 'fundAmountChanged',
  FUND_FAILURE: 'fundFailure',
  FUND_INITIATED: 'fundInitiated',
  FUND_OPTION_SELECTED: 'fundOptionSelected',
  FUND_SUCCESS: 'fundSuccess',
  FUND_CANCELLED: 'fundCancelled',

  // Mint events
  MINT_FAILURE: 'mintFailure',
  MINT_INITIATED: 'mintInitiated',
  MINT_QUANTITY_CHANGED: 'mintQuantityChanged',
  MINT_SUCCESS: 'mintSuccess',
  MINT_CANCELLED: 'mintCancelled',

  // Swap events
  SWAP_FAILURE: 'swapFailure',
  SWAP_INITIATED: 'swapInitiated',
  SWAP_SLIPPAGE_CHANGED: 'swapSlippageChanged',
  SWAP_SUCCESS: 'swapSuccess',
  SWAP_TOKEN_SELECTED: 'swapTokenSelected',
  SWAP_CANCELLED: 'swapCancelled',

  // Transaction events
  TRANSACTION_FAILURE: 'transactionFailure',
  TRANSACTION_INITIATED: 'transactionInitiated',
  TRANSACTION_SUCCESS: 'transactionSuccess',
  TRANSACTION_CANCELLED: 'transactionCancelled',

  // Wallet events
  WALLET_CONNECT_ERROR: 'walletConnectError',
  WALLET_CONNECT_INITIATED: 'walletConnectInitiated',
  WALLET_CONNECT_SUCCESS: 'walletConnectSuccess',
  WALLET_DISCONNECT: 'walletDisconnect',
  WALLET_OPTION_SELECTED: 'walletOptionSelected',
  WALLET_CONNECT_CANCELLED: 'walletConnectCancelled',

  // Earn events
  EARN_DEPOSIT_INITIATED: 'earnDepositInitiated',
  EARN_DEPOSIT_SUCCESS: 'earnDepositSuccess',
  EARN_DEPOSIT_FAILURE: 'earnDepositFailure',
  EARN_DEPOSIT_CANCELLED: 'earnDepositCancelled',
  EARN_WITHDRAW_INITIATED: 'earnWithdrawInitiated',
  EARN_WITHDRAW_SUCCESS: 'earnWithdrawSuccess',
  EARN_WITHDRAW_FAILURE: 'earnWithdrawFailure',
  EARN_WITHDRAW_CANCELLED: 'earnWithdrawCancelled',
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
