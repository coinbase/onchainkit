import { describe, expect, test } from 'vitest';
import { formatAmount } from './formatAmount'; // Adjust the import path as necessary

describe('formatAmount', () => {
  test('should return non-scientific notation numbers as-is', () => {
    expect(formatAmount('123.45')).toBe('123.45');
    expect(formatAmount('0.0001')).toBe('0.0001');
    expect(formatAmount('-789')).toBe('-789');
  });

  test('should format positive numbers in scientific notation', () => {
    expect(formatAmount('1e3')).toBe('1000');
    expect(formatAmount('1.23e4')).toBe('12300');
    expect(formatAmount('1.23e-4')).toBe('0.000123');
    expect(formatAmount('1.23e-6')).toBe('0.00000123');
  });

  test('should handle large exponents', () => {
    expect(formatAmount('1e20')).toBe('100000000000000000000');
    expect(formatAmount('1e-20')).toBe('0.00000000000000000001');
  });

  test('should handle numbers with decimal parts', () => {
    expect(formatAmount('1.23456e3')).toBe('1234.56');
    expect(formatAmount('1.23456e-3')).toBe('0.00123456');
  });

  test('should handle numbers where exponent affects decimal placement', () => {
    expect(formatAmount('1.23e2')).toBe('123');
    expect(formatAmount('1.23e1')).toBe('12.3');
    expect(formatAmount('1.23e-1')).toBe('0.123');
    expect(formatAmount('1.23e-2')).toBe('0.0123');
  });
});
