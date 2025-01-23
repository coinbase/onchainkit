export const FALLBACK_DEFAULT_MAX_SLIPPAGE = 3;
export const GENERAL_SWAP_ERROR_CODE = 'SWAP_ERROR';
export const GENERAL_SWAP_QUOTE_ERROR_CODE = 'SWAP_QUOTE_ERROR';
export const GENERAL_SWAP_BALANCE_ERROR_CODE = 'SWAP_BALANCE_ERROR';
export const LOW_LIQUIDITY_ERROR_CODE = 'SWAP_QUOTE_LOW_LIQUIDITY_ERROR';
export const PERMIT2_CONTRACT_ADDRESS =
  '0x000000000022D473030F116dDEE9F6B43aC78BA3';
export const TOO_MANY_REQUESTS_ERROR_CODE = 'TOO_MANY_REQUESTS_ERROR';
export const UNCAUGHT_SWAP_QUOTE_ERROR_CODE = 'UNCAUGHT_SWAP_QUOTE_ERROR';
export const UNCAUGHT_SWAP_ERROR_CODE = 'UNCAUGHT_SWAP_ERROR';
export const UNIVERSALROUTER_CONTRACT_ADDRESS =
  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';
export const USER_REJECTED_ERROR_CODE = 'USER_REJECTED';
export const UNSUPPORTED_AMOUNT_REFERENCE_ERROR_CODE =
  'UNSUPPORTED_AMOUNT_REFERENCE_ERROR';
export enum SwapMessage {
  BALANCE_ERROR = 'Error fetching token balance',
  CONFIRM_IN_WALLET = 'Confirm in wallet',
  FETCHING_QUOTE = 'Fetching quote...',
  FETCHING_BALANCE = 'Fetching balance...',
  INCOMPLETE_FIELD = 'Complete the fields to continue',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  LOW_LIQUIDITY = 'Insufficient liquidity for this trade.',
  SWAP_IN_PROGRESS = 'Swap in progress...',
  TOO_MANY_REQUESTS = 'Too many requests. Please try again later.',
  USER_REJECTED = 'User rejected the transaction',
  UNSUPPORTED_AMOUNT_REFERENCE = 'useAggregator does not support amountReference: to, please use useAggregator: false',
}

export const ONRAMP_PAYMENT_METHODS = [
  {
    id: 'CRYPTO_ACCOUNT',
    name: 'Coinbase',
    description: 'Buy with your Coinbase account',
    icon: 'coinbasePay',
  },
  {
    id: 'APPLE_PAY',
    name: 'Apple Pay',
    description: 'Up to $500/week',
    icon: 'applePay',
  },
  {
    id: 'CARD',
    name: 'Debit Card',
    description: 'Up to $500/week',
    icon: 'creditCard',
  },
];
