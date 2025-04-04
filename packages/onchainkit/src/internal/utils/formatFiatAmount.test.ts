import { describe, expect, it } from 'vitest';
import { formatFiatAmount } from './formatFiatAmount';

describe('formatFiatAmount', () => {
  it('uses USD as default currency', () => {
    expect(formatFiatAmount({ amount: 100, locale: 'en-US' })).toBe('$100.00');
  });

  it('formats whole numbers with default 2 decimal places', () => {
    expect(formatFiatAmount({ amount: 100, locale: 'en-US' })).toBe('$100.00');
    expect(formatFiatAmount({ amount: '100', locale: 'en-US' })).toBe(
      '$100.00',
    );
  });

  it('formats decimal numbers correctly', () => {
    expect(formatFiatAmount({ amount: 100.5, locale: 'en-US' })).toBe(
      '$100.50',
    );
    expect(formatFiatAmount({ amount: '100.5', locale: 'en-US' })).toBe(
      '$100.50',
    );
    expect(formatFiatAmount({ amount: 100.55, locale: 'en-US' })).toBe(
      '$100.55',
    );
  });

  it('handles zero correctly', () => {
    expect(formatFiatAmount({ amount: 0, locale: 'en-US' })).toBe('$0.00');
    expect(formatFiatAmount({ amount: '0', locale: 'en-US' })).toBe('$0.00');
  });

  it('formats different currencies correctly', () => {
    expect(
      formatFiatAmount({ amount: 100, currency: 'EUR', locale: 'en-US' }),
    ).toBe('€100.00');
    expect(
      formatFiatAmount({ amount: 100, currency: 'GBP', locale: 'en-US' }),
    ).toBe('£100.00');
    expect(
      formatFiatAmount({ amount: 100, currency: 'JPY', locale: 'en-US' }),
    ).toBe('¥100.00');
  });

  it('respects different locales', () => {
    expect(
      formatFiatAmount({
        amount: 1000.5,
        currency: 'EUR',
        locale: 'de-DE',
      })
        .replace(/\u00A0/g, ' ')
        .trim(),
    ).toBe('1.000,50 €'.replace(/\u00A0/g, ' ').trim());

    expect(
      formatFiatAmount({
        amount: 1000.5,
        currency: 'USD',
        locale: 'fr-FR',
      })
        .replace(/\u00A0/g, ' ')
        .trim(),
    ).toBe('1\u202f000,50 $US'.replace(/\u00A0/g, ' ').trim());
  });

  it('allows custom fraction digits', () => {
    expect(
      formatFiatAmount({
        amount: 100.5,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    ).toBe('$101');

    expect(
      formatFiatAmount({
        amount: 100.5,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
    ).toBe('$100.5');

    expect(
      formatFiatAmount({
        amount: 100.555,
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }),
    ).toBe('$100.555');
  });

  it('handles very small numbers correctly', () => {
    expect(formatFiatAmount({ amount: 0.01 })).toBe('$0.01');
    expect(formatFiatAmount({ amount: 0.001 })).toBe('$0.00');
    // With 3 decimal places
    expect(formatFiatAmount({ amount: 0.001, maximumFractionDigits: 3 })).toBe(
      '$0.001',
    );
  });

  it('handles very large numbers correctly', () => {
    expect(formatFiatAmount({ amount: 1000000 })).toBe('$1,000,000.00');
    expect(formatFiatAmount({ amount: '1000000.5' })).toBe('$1,000,000.50');
  });

  it('handles invalid input gracefully', () => {
    expect(() => formatFiatAmount({ amount: 'invalid' })).not.toThrow();
    expect(formatFiatAmount({ amount: 'invalid' })).toBe('$0.00');
    expect(formatFiatAmount({ amount: Number.NaN })).toBe('$0.00');
    /* eslint-disable @typescript-eslint/no-explicit-any */
    expect(formatFiatAmount({ amount: undefined as any })).toBe('$0.00');
  });
});
