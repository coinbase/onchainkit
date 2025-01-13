import type { PaymentMethodReact } from './types';

export const DEFAULT_ONRAMP_URL = 'https://pay.coinbase.com';
// The base URL for the Coinbase Onramp widget.
export const ONRAMP_BUY_URL = `${DEFAULT_ONRAMP_URL}/buy`;
// The recommended height of a Coinbase Onramp popup window.
export const ONRAMP_POPUP_HEIGHT = 720;
// The recommended width of a Coinbase Onramp popup window.
export const ONRAMP_POPUP_WIDTH = 460;
export const ONRAMP_API_BASE_URL =
  'https://api.developer.coinbase.com/onramp/v1';
// Time in milliseconds to wait before resetting the button state to default after a transaction is completed.
export const FUND_BUTTON_RESET_TIMEOUT = 3000;

export const COINBASE: PaymentMethodReact = {
  id: '',
  name: 'Coinbase',
  description: 'ACH, cash, crypto and balance',
  icon: 'coinbaseLogo',
};

export const DEBIT_CARD: PaymentMethodReact = {
  id: 'ACH_BANK_ACCOUNT',
  name: 'Debit Card',
  description: 'Up to $500/week. No sign up required.',
  icon: 'creditCard',
};

export const APPLE_PAY: PaymentMethodReact = {
  id: 'APPLE_PAY',
  name: 'Apple Pay',
  description: 'Up to $500/week. No sign up required.',
  icon: 'applePay',
};

export const ALL_PAYMENT_METHODS = [COINBASE, DEBIT_CARD, APPLE_PAY];

// Preset combinations
export const PAYMENT_METHODS = {
  ALL: ALL_PAYMENT_METHODS,
  CARD_AND_COINBASE: [COINBASE, DEBIT_CARD],
  COINBASE_ONLY: [COINBASE],
  CARD_ONLY: [DEBIT_CARD],
} as const;

export const DEFAULT_PAYMENT_METHODS = PAYMENT_METHODS.ALL;
