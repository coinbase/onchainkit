import type { PaymentMethod } from '../types';

export const COINBASE: PaymentMethod = {
  id: 'FIAT_WALLET',
  name: 'Coinbase',
  description: 'Buy with your Coinbase account',
  icon: 'coinbaseLogo',
};

export const DEBIT_CARD: PaymentMethod = {
  id: 'ACH_BANK_ACCOUNT',
  name: 'Debit Card',
  description: 'Up to $500/week',
  icon: 'creditCard',
};

export const APPLE_PAY: PaymentMethod = {
  id: 'APPLE_PAY',
  name: 'Apple Pay',
  description: 'Fast and secure checkout',
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
