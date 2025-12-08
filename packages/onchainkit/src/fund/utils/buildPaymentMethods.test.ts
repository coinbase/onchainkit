import { describe, expect, it } from 'vitest';
import type { OnrampOptionsResponseData } from '../types';
import {
  buildCoinbasePaymentMethodDescription,
  buildPaymentMethods,
} from './buildPaymentMethods';

describe('buildPaymentMethods', () => {
  const mockPaymentOptions: OnrampOptionsResponseData = {
    paymentCurrencies: [
      {
        id: 'USD',
        iconUrl: 'https://example.com/usd.png',
        limits: [
          { id: 'CARD', min: '10', max: '500' },
          { id: 'APPLE_PAY', min: '5', max: '300' },
          { id: 'ACH_BANK_ACCOUNT', min: '2', max: '1000' },
        ],
      },
    ],
    purchaseCurrencies: [],
  };

  describe('buildCoinbasePaymentMethodDescription', () => {
    it('builds description with available methods', () => {
      const description = buildCoinbasePaymentMethodDescription([
        { id: 'CARD' },
        { id: 'ACH_BANK_ACCOUNT' },
      ]);
      expect(description).toBe('ACH, debit, cash, crypto balance');
    });

    it('handles missing optional methods', () => {
      const description = buildCoinbasePaymentMethodDescription([
        { id: 'CARD' },
      ]);
      expect(description).toBe('debit, cash, crypto balance');
    });
  });

  describe('buildPaymentMethods', () => {
    it('returns empty array when currency not found', () => {
      const result = buildPaymentMethods(mockPaymentOptions, 'EUR', 'GB');
      expect(result).toHaveLength(0);
    });

    it('returns only Coinbase method for non-US country', () => {
      const result = buildPaymentMethods(mockPaymentOptions, 'USD', 'GB');
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: '',
        name: 'Coinbase',
        description: 'ACH, debit, cash, crypto balance',
        icon: 'coinbaseLogo',
        minAmount: 2,
        maxAmount: 1000,
      });
    });

    it('returns Coinbase and US methods for US/USD', () => {
      const result = buildPaymentMethods(mockPaymentOptions, 'USD', 'US');
      expect(result).toHaveLength(3);

      // Check Coinbase method
      expect(result[0]).toMatchObject({
        id: '',
        name: 'Coinbase',
        icon: 'coinbaseLogo',
      });

      // Check Apple Pay method
      expect(result[1]).toMatchObject({
        id: 'APPLE_PAY',
        name: 'Apple Pay',
        icon: 'apple',
        minAmount: 5,
        maxAmount: 300,
      });

      // Check Card method
      expect(result[2]).toMatchObject({
        id: 'CARD',
        name: 'Debit card',
        icon: 'creditCard',
        minAmount: 10,
        maxAmount: 500,
      });
    });

    it('uses default limits when limits not provided', () => {
      const optionsWithoutLimits: OnrampOptionsResponseData = {
        paymentCurrencies: [
          {
            id: 'USD',
            iconUrl: 'https://example.com/usd.png',
            limits: [{ id: 'CARD', min: '', max: '' }],
          },
        ],
        purchaseCurrencies: [],
      };

      const result = buildPaymentMethods(optionsWithoutLimits, 'USD', 'US');

      // Check Card method has default limits
      const cardMethod = result.find((m) => m.id === 'CARD');
      expect(cardMethod).toMatchObject({
        minAmount: 2, // DEFAULT_MIN_AMOUNT
        maxAmount: 500, // DEFAULT_MAX_AMOUNT
      });
    });
  });
});
