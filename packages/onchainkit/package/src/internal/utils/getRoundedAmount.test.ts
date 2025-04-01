import { describe, expect, it } from 'vitest';
import { getRoundedAmount } from './getRoundedAmount';
describe('getRoundedAmount', () => {
  it('returns a rounded number with specified decimal places', () => {
    const balance = '0.0002851826238227';
    const fractionDigits = 5;
    const result = getRoundedAmount(balance, fractionDigits);
    expect(result).toBe('0.00029');
  });

  it('returns a rounded number with more decimal places than available', () => {
    const balance = '123.456';
    const fractionDigits = 10;
    const result = getRoundedAmount(balance, fractionDigits);
    expect(result).toBe('123.456');
  });

  it('handles 0 amount correctly', () => {
    const balance = '0';
    const fractionDigits = 10;
    const result = getRoundedAmount(balance, fractionDigits);
    expect(result).toBe('0');
  });

  it('return 0 when user has more than 0 but less than the fractionDigits', () => {
    const balance = '0.00004';
    const fractionDigits = 4;
    const result = getRoundedAmount(balance, fractionDigits);
    expect(result).toBe('0');
  });
});
