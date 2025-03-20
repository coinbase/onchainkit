import { describe, expect, it } from 'vitest';
import { formatTokenAmount } from './formatTokenAmount';

describe('formatTokenAmount', () => {
  it('should format amount correctly with 18 decimals', () => {
    const amount = '100000000000000000';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('0.1');
  });

  it('should format amount correctly with different decimals', () => {
    const amount = '1000000000';
    const decimals = 9;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('1');
  });

  it('should handle very small amounts correctly', () => {
    const amount = '1';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('1e-18');
  });

  it('should handle zero amount correctly', () => {
    const amount = '0';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('0');
  });

  it('should handle large amounts correctly', () => {
    const amount = '1000000000000000000000000000';
    const decimals = 18;
    const formattedAmount = formatTokenAmount(amount, decimals);
    expect(formattedAmount).toBe('1000000000');
  });
});
