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

export const DEFAULT_PAYMENT_METHODS: PaymentMethodReact[] = [
  {
    id: 'FIAT_WALLET',
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
    id: 'ACH_BANK_ACCOUNT',
    name: 'Debit Card',
    description: 'Up to $500/week',
    icon: 'creditCard',
  },
];
