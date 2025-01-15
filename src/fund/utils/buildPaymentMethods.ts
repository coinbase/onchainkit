import { formatFiatAmount } from '@/core/utils/formatFiatAmount';
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
  APPLE_PAY: 'apple',
  CRYPTO_ACCOUNT: 'coinbaseLogo',
  FIAT_WALLET: 'fundWallet',
};

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

  const coinbasePaymentMethod: PaymentMethodReact = {
    id: '',
    name: 'Coinbase',
    description, // e.g. "card, ACH, and balance"
    icon: 'coinbaseLogo',
  };

  /**
   * We need to show to the user "Card" and "Apple Pay" if they are returned by the API.
   */
  const otherPaymentMethods: PaymentMethodReact[] = paymentMethod.limits
    .filter((limit) => limit.id === 'CARD' || limit.id === 'APPLE_PAY')
    .map((limit) => ({
      id: limit.id,
      name: PAYMENT_METHOD_NAMES_MAP[limit.id],
      description: `Up to ${formatFiatAmount({
        amount: limit.max,
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}/week. No sign up required.`,
      icon: PAYMENT_METHOD_ICONS_MAP[limit.id],
      minAmount: Number(limit.min),
      maxAmount: Number(limit.max),
    }));

  //The API does not return Apple Pay yet, so we need to add it manually.
  const applePayExists = otherPaymentMethods.some(
    (method) => method.id === 'APPLE_PAY',
  );

  if (!applePayExists) {
    otherPaymentMethods.push({
      id: 'APPLE_PAY',
      name: PAYMENT_METHOD_NAMES_MAP.APPLE_PAY,
      description: 'Up to $500/week. No sign up required.',
      icon: PAYMENT_METHOD_ICONS_MAP.APPLE_PAY,
      minAmount: 0,
      maxAmount: 0,
    });
  }

  return [coinbasePaymentMethod, ...otherPaymentMethods];
};
