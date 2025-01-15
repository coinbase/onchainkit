import type { OnrampOptionsResponseData, PaymentMethodReact } from '../types';

const PAYMENT_METHOD_NAMES_MAP: Record<string, string> = {
  CARD: 'Debit card',
  ACH_BANK_ACCOUNT: 'ACH',
  APPLE_PAY: 'Apple Pay',
};

const PAYMENT_METHOD_ICONS_MAP: Record<string, string> = {
  CARD: 'creditCard',
  ACH_BANK_ACCOUNT: 'bank',
  APPLE_PAY: 'apple',
  CRYPTO_ACCOUNT: 'coinbaseLogo',
  FIAT_WALLET: 'fundWallet',
};

const DEFAULT_MIN_AMOUNT = 2;
const DEFAULT_MAX_AMOUNT = 500;

/**
 * Coinbase payment method description is built using the available payment methods and adding Cash and Crypto Balance to the end of the array.
 * i.e. If the API returns Card and ACH, the description will be "Card, ACH, Cash, Crypto Balance".
 */
export const buildCoinbasePaymentMethodDescription = (
  paymentMethodLimits: Array<{ id: string }>,
) => {
  // Map the IDs to their readable names
  const methods = paymentMethodLimits.map(
    (limit) => PAYMENT_METHOD_NAMES_MAP[limit.id],
  );

  // Add Cash and Crypto Balance to the end of the array (These are not returned by the API)
  methods.push('Cash');
  methods.push('Crypto Balance');

  return methods.join(', ');
};

export const buildPaymentMethods = (
  paymentOptions: OnrampOptionsResponseData,
  currency: string,
  country: string,
) => {
  const paymentMethod = paymentOptions.paymentCurrencies.find(
    (paymentCurrency) => paymentCurrency.id === currency,
  );

  if (!paymentMethod) {
    return [];
  }

  const description = buildCoinbasePaymentMethodDescription(
    paymentMethod.limits,
  );

  const largestLimit = paymentMethod.limits.reduce((max, limit) => {
    return Math.max(max, Number(limit.max));
  }, 0);

  const smallestLimit = paymentMethod.limits.reduce((min, limit) => {
    return Math.min(min, Number(limit.min));
  }, Number.POSITIVE_INFINITY);

  const coinbasePaymentMethod: PaymentMethodReact = {
    id: '',
    name: 'Coinbase',
    description, // e.g. "card, ACH, and balance"
    icon: 'coinbaseLogo',
    minAmount: smallestLimit,
    maxAmount: largestLimit,
  };

  /**
   * We need to show to the US user "Card" and "Apple Pay" options
   */
  const usPaymentMethods: PaymentMethodReact[] = [];

  if (country === 'US' && currency === 'USD') {
    const applePayLimit = paymentMethod.limits.find(
      (limit) => limit.id === 'APPLE_PAY',
    );

    const applePayMinAmount = Number(applePayLimit?.min) || DEFAULT_MIN_AMOUNT;
    const applePayMaxAmount = Number(applePayLimit?.max) || DEFAULT_MAX_AMOUNT;

    usPaymentMethods.push({
      id: 'APPLE_PAY',
      name: PAYMENT_METHOD_NAMES_MAP.APPLE_PAY,
      description: 'Up to $500/week. No sign up required.',
      icon: PAYMENT_METHOD_ICONS_MAP.APPLE_PAY,
      minAmount: applePayMinAmount,
      maxAmount: applePayMaxAmount,
    });

    const cardLimit = paymentMethod.limits.find((limit) => limit.id === 'CARD');

    const cardMinAmount = Number(cardLimit?.min) || DEFAULT_MIN_AMOUNT;
    const cardMaxAmount = Number(cardLimit?.max) || DEFAULT_MAX_AMOUNT;

    usPaymentMethods.push({
      id: 'CARD',
      name: PAYMENT_METHOD_NAMES_MAP.CARD,
      description: 'Up to $500/week. No sign up required.',
      icon: PAYMENT_METHOD_ICONS_MAP.CARD,
      minAmount: cardMinAmount,
      maxAmount: cardMaxAmount,
    });
  }

  return [coinbasePaymentMethod, ...usPaymentMethods];
};
