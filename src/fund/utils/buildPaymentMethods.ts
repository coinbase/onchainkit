import type { OnrampOptionsResponseData, PaymentMethodReact } from '../types';

const PAYMENT_METHOD_NAMES_MAP: Record<string, string> = {
  card: 'debit',
  ach_bank_account: 'ACH',
  apple_pay: 'Apple Pay',
  crypto_account: 'crypto balance',
  fiat_wallet: 'cash',
};

const PAYMENT_METHOD_ICONS_MAP: Record<string, string> = {
  card: 'creditCard',
  ach_bank_account: 'bank',
  apple_pay: 'applePay',
  crypto_account: 'coinbaseLogo',
  fiat_wallet: 'fundWallet',
};

export const buildCoinbasePaymentDescription = (
  paymentMethodLimits: Array<{ id: string }>,
) => {
  // Map the IDs to their readable names
  const methods = paymentMethodLimits.map(
    (limit) => PAYMENT_METHOD_NAMES_MAP[limit.id],
  );

  // Handle empty case
  if (methods.length === 0) {
    return '';
  }

  if (methods.length === 1) {
    return methods[0];
  }
  if (methods.length === 2) {
    return `${methods[0]} and ${methods[1]}`;
  }

  const lastMethod = methods.pop();
  return `${methods.join(', ')}, and ${lastMethod}`;
};

export const buildPaymentMethods = (
  paymentOptions: OnrampOptionsResponseData,
) => {
  const paymentMethods = paymentOptions.paymentCurrencies[0];

  const description = buildCoinbasePaymentDescription(
    paymentMethods.paymentMethodLimits,
  );

  const coinbasePaymentMethod: PaymentMethodReact = {
    id: '',
    name: 'Coinbase',
    description, // e.g. "card, ACH, and balance"
    icon: PAYMENT_METHOD_ICONS_MAP.coinbase,
  };

  const otherPaymentMethods: PaymentMethodReact[] =
    paymentMethods.paymentMethodLimits
      .filter(
        (limit) =>
          limit.id === 'ach_bank_account' ||
          limit.id === 'card' ||
          limit.id === 'cash',
      )
      .map((limit) => ({
        id: limit.id,
        name: PAYMENT_METHOD_NAMES_MAP[limit.id],
        description: limit.id,
        icon: PAYMENT_METHOD_ICONS_MAP[limit.id],
      }));

  return [coinbasePaymentMethod, ...otherPaymentMethods];
};
