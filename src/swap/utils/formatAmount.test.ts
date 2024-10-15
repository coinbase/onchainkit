import { describe, expect, it } from 'vitest';
import { formatAmount } from './formatAmount';

describe('formatAmount', () => {
  // Test cases for positive exponents
  it('should correctly format numbers with positive exponents', () => {
    expect(formatAmount('1.23e5')).toBe('123000');
    expect(formatAmount('4.56e2')).toBe('456');
    expect(formatAmount('7.89e0')).toBe('7.89');
    expect(formatAmount('1e10')).toBe('10000000000');
  });

  // Test cases for negative exponents
  it('should correctly format numbers with negative exponents', () => {
    expect(formatAmount('1.23e-5')).toBe('0.0000123');
    expect(formatAmount('4.56e-2')).toBe('0.0456');
    expect(formatAmount('7.89e-1')).toBe('0.789');
  });

  // Test cases for numbers not in scientific notation
  it('should not modify numbers not in scientific notation', () => {
    expect(formatAmount('123.45')).toBe('123.45');
    expect(formatAmount('0.0001')).toBe('0.0001');
    expect(formatAmount('1000000')).toBe('1000000');
  });

  // Edge cases
  it('should handle edge cases correctly', () => {
    expect(formatAmount('0e0')).toBe('0');
    expect(formatAmount('1e-0')).toBe('1');
    expect(formatAmount('1.0e+5')).toBe('100000');
    expect(formatAmount('1.000e-10')).toBe('0.0000000001');
  });

  // Large numbers
  it('should handle very large numbers', () => {
    expect(formatAmount('1.23e20')).toBe('123000000000000000000');
    expect(formatAmount('9.99e99')).toBe(
      '99900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    );
  });

  // Very small numbers
  it('should handle very small numbers', () => {
    expect(formatAmount('1.23e-20')).toBe('0.0000000000000000000123');
    expect(formatAmount('9.99e-99')).toBe(
      '0.0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000999',
    );
  });

  // Numbers with multiple 'e' characters (invalid input)
  it('should return the input string for invalid scientific notation', () => {
    expect(formatAmount('1.23e4e5')).toBe('1.23e4e5');
    expect(formatAmount('1e2e3')).toBe('1e2e3');
  });
});
