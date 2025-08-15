import { describe, expect, test } from 'vitest';
import { formatToDecimalString } from './formatter';

describe('formatter', () => {
  describe('formatToDecimalString', () => {
    test('should return non-scientific notation numbers as-is', () => {
      expect(formatToDecimalString('123.45')).toBe('123.45');
      expect(formatToDecimalString('0.0001')).toBe('0.0001');
      expect(formatToDecimalString('-789')).toBe('-789');
    });

    test('should format positive numbers in scientific notation', () => {
      expect(formatToDecimalString('1e3')).toBe('1000');
      expect(formatToDecimalString('1.23e4')).toBe('12300');
      expect(formatToDecimalString('1.23e-4')).toBe('0.000123');
      expect(formatToDecimalString('1.23e-6')).toBe('0.00000123');
    });

    test('should handle large exponents', () => {
      expect(formatToDecimalString('1e20')).toBe('100000000000000000000');
      expect(formatToDecimalString('1e-20')).toBe('0.00000000000000000001');
    });

    test('should handle numbers with decimal parts', () => {
      expect(formatToDecimalString('1.23456e3')).toBe('1234.56');
      expect(formatToDecimalString('1.23456e-3')).toBe('0.00123456');
    });

    test('should handle numbers where exponent affects decimal placement', () => {
      expect(formatToDecimalString('1.23e2')).toBe('123');
      expect(formatToDecimalString('1.23e1')).toBe('12.3');
      expect(formatToDecimalString('1.23e-1')).toBe('0.123');
      expect(formatToDecimalString('1.23e-2')).toBe('0.0123');
    });
  });
});
