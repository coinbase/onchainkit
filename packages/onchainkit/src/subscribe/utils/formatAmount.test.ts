import { describe, expect, it } from 'vitest';
import {
  formatSubscriptionAmount,
  formatPeriodShort,
  formatSubscriptionText,
} from './formatAmount';
import type { Duration } from '../types';
import type { Token } from '@/token';

describe('formatSubscriptionAmount', () => {
  it('should format USD stablecoins with $ prefix', () => {
    const usdcToken: Token = {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0xA0b86a33E6441a8e7f0c4e2e7b4b3c7d8e9f0a1b',
      chainId: 1,
      image: '',
    };

    expect(formatSubscriptionAmount('10', usdcToken)).toBe('$10');
    expect(formatSubscriptionAmount('100.50', usdcToken)).toBe('$100.50');
  });

  it('should format other tokens with symbol suffix', () => {
    const ethToken: Token = {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      address: '',
      chainId: 1,
      image: '',
    };

    expect(formatSubscriptionAmount('1', ethToken)).toBe('1 ETH');
    expect(formatSubscriptionAmount('0.5', ethToken)).toBe('0.5 ETH');
  });

  it('should handle case-insensitive stablecoin detection', () => {
    const daiToken: Token = {
      name: 'Dai Stablecoin',
      symbol: 'dai', // lowercase
      decimals: 18,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      chainId: 1,
      image: '',
    };

    expect(formatSubscriptionAmount('25', daiToken)).toBe('$25');
  });
});

describe('formatPeriodShort', () => {
  it('should format single time units correctly', () => {
    expect(formatPeriodShort({ days: 30 })).toBe('month'); // Special case for 30 days
    expect(formatPeriodShort({ days: 28 })).toBe('month'); // Special case for 28 days
    expect(formatPeriodShort({ days: 31 })).toBe('month'); // Special case for 31 days
    expect(formatPeriodShort({ days: 7 })).toBe('day'); // Regular days
    expect(formatPeriodShort({ weeks: 1 })).toBe('week');
    expect(formatPeriodShort({ months: 1 })).toBe('month');
    expect(formatPeriodShort({ years: 1 })).toBe('year');
  });

  it('should prioritize larger time units', () => {
    expect(formatPeriodShort({ months: 1, days: 15 })).toBe('month');
    expect(formatPeriodShort({ years: 1, months: 6 })).toBe('year');
  });

  it('should only apply monthly special case for days-only durations', () => {
    // Should not apply special case when other units are present
    expect(formatPeriodShort({ days: 30, hours: 1 })).toBe('day');
    expect(formatPeriodShort({ weeks: 1, days: 30 })).toBe('week');
  });
});

describe('formatSubscriptionText', () => {
  const usdcToken: Token = {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0xA0b86a33E6441a8e7f0c4e2e7b4b3c7d8e9f0a1b',
    chainId: 1,
    image: '',
  };

  it('should format subscription text for USD stablecoins', () => {
    const interval: Duration = { days: 30 };
    expect(formatSubscriptionText('10', usdcToken, interval)).toBe(
      'Subscribe $10/month',
    );
  });

  it('should format subscribed text', () => {
    const interval: Duration = { months: 1 };
    expect(
      formatSubscriptionText('25', usdcToken, interval, 'subscribed'),
    ).toBe('Subscribed to $25/month');
  });
});
