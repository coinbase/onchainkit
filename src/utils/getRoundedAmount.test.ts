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
});
