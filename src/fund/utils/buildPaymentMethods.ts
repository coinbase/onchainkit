import type { OnrampOptionsResponseData, PaymentMethodReact } from '../types';

const PAYMENT_METHOD_NAMES_MAP: Record<string, string> = {
  CARD: 'Debit card',
  ACH_BANK_ACCOUNT: 'ACH',
  APPLE_PAY: 'Apple Pay',
  // CRYPTO_ACCOUNT: 'Crypto Balance',
  // FIAT_WALLET: 'Cash',
};

const PAYMENT_METHOD_ICONS_MAP: Record<string, string> = {
  CARD: 'creditCard',
  ACH_BANK_ACCOUNT: 'bank',
  APPLE_PAY: 'applePay',
  CRYPTO_ACCOUNT: 'coinbaseLogo',
  FIAT_WALLET: 'fundWallet',
};

export const buildCoinbasePaymentDescription = (
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
) => {
  const paymentMethod = paymentOptions.paymentCurrencies.find(
    (paymentCurrency) => paymentCurrency.id === currency,
  );

  if (!paymentMethod) {
    return [];
  }

  const description = buildCoinbasePaymentDescription(paymentMethod.limits);

  const coinbasePaymentMethod: PaymentMethodReact = {
    id: '',
    name: 'Coinbase',
    description, // e.g. "card, ACH, and balance"
    icon: 'coinbaseLogo',
  };

  /**
   * We need to show to the user Card and Apple Pay if they are returned by the API.
   */
  const otherPaymentMethods: PaymentMethodReact[] = paymentMethod.limits
    .filter(
      (limit) =>
        //limit.id === 'ACH_BANK_ACCOUNT' ||
        limit.id === 'CARD' || limit.id === 'APPLE_PAY',
    )
    .map((limit) => ({
      id: limit.id,
      name: PAYMENT_METHOD_NAMES_MAP[limit.id],
      description: limit.id,
      icon: PAYMENT_METHOD_ICONS_MAP[limit.id],
      minAmount: limit.min,
      maxAmount: limit.max,
    }));

  return [coinbasePaymentMethod, ...otherPaymentMethods];
};
