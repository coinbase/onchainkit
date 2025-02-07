import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { describe, expect, it } from 'vitest';
import { getDefaultSendButtonLabel } from './getDefaultSendButtonLabel';

describe('getDefaultSendButtonLabel', () => {
  const mockToken = {
    address: '0x1230000000000000000000000000000000000000',
    symbol: 'TEST',
    name: 'Test Token',
    decimals: 18,
    cryptoBalance: 1000000000000000,
    fiatBalance: 100,
    image: 'test.png',
    chainId: 8453,
  } as PortfolioTokenWithFiatValue;

  it('returns "Input amount" when cryptoAmount is null', () => {
    expect(getDefaultSendButtonLabel(null, mockToken)).toBe('Input amount');
  });

  it('returns "Input amount" when cryptoAmount is empty string', () => {
    expect(getDefaultSendButtonLabel('', mockToken)).toBe('Input amount');
  });

  it('returns "Select token" when token is null', () => {
    expect(getDefaultSendButtonLabel('1.0', null)).toBe('Select token');
  });

  it('returns "Insufficient balance" when amount exceeds balance', () => {
    expect(getDefaultSendButtonLabel('2.0', mockToken)).toBe(
      'Insufficient balance',
    );
  });

  it('returns "Continue" when amount is valid and within balance', () => {
    expect(getDefaultSendButtonLabel('0.0001', mockToken)).toBe('Continue');
  });

  it('returns "Continue" when amount equals balance exactly', () => {
    expect(getDefaultSendButtonLabel('0.001', mockToken)).toBe('Continue');
  });
});
