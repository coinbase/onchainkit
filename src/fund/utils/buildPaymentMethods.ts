import type {
  OnrampOptionsResponseData,
  OnrampPaymentCurrency,
  PaymentMethod,
} from '../types';

const DEFAULT_MIN_AMOUNT = 2;
const DEFAULT_MAX_AMOUNT = 500;

/**
 * Coinbase payment method description is built using the available payment methods and adding Cash and Crypto Balance to the end of the array.
 * i.e. If the API returns Card and ACH, the description will be "Card, ACH, Cash, Crypto Balance".
 */
export const buildCoinbasePaymentMethodDescription = (
  paymentMethodLimits: Array<{ id: string }>,
) => {
  const availableMethods = [
    // Check API-provided methods
    paymentMethodLimits.some((limit) => limit.id === 'ACH_BANK_ACCOUNT') &&
      'ACH',
    paymentMethodLimits.some((limit) => limit.id === 'CARD') && 'debit',
    // Always include these methods
    'cash',
    'crypto balance',
  ].filter(Boolean); // Remove falsy values

  return availableMethods.join(', ');
};

const buildCoinbasePaymentMethod = ({
  limits,
}: OnrampPaymentCurrency): PaymentMethod => ({
  id: '',
  name: 'Coinbase',
  description: buildCoinbasePaymentMethodDescription(limits),
  icon: 'coinbaseLogo',
  minAmount: Math.min(...limits.map((l) => Number(l.min))),
  maxAmount: Math.max(...limits.map((l) => Number(l.max))),
});

const buildUSPaymentMethods = (
  paymentCurrency: OnrampPaymentCurrency,
): PaymentMethod[] => {
  const paymentMethodConfigs = [
    {
      id: 'APPLE_PAY',
      name: 'Apple Pay',
      icon: 'apple',
    },
    {
      id: 'CARD',
      name: 'Debit card',
      icon: 'creditCard',
    },
  ];

  return paymentMethodConfigs.map((config) => {
    const limit = paymentCurrency.limits.find(
      (limit) => limit.id === config.id,
    );

    return {
      ...config,
      description: 'Up to $500/week. No sign up required.',
      minAmount: Number(limit?.min) || DEFAULT_MIN_AMOUNT,
      maxAmount: Number(limit?.max) || DEFAULT_MAX_AMOUNT,
    };
  });
};

export const buildPaymentMethods = (
  paymentOptions: OnrampOptionsResponseData,
  currency: string,
  country: string,
) => {
  const paymentCurrency = paymentOptions.paymentCurrencies.find(
    (paymentCurrency) => paymentCurrency.id === currency,
  );

  if (!paymentCurrency) {
    return [];
  }

  const coinbasePaymentMethod = buildCoinbasePaymentMethod(paymentCurrency);

  let usPaymentMethods: PaymentMethod[] = [];
  if (country === 'US' && currency === 'USD') {
    usPaymentMethods = buildUSPaymentMethods(paymentCurrency);
  }

  return [coinbasePaymentMethod, ...usPaymentMethods];
};
