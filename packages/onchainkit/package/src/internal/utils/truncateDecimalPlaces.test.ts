import { describe, expect, it } from 'vitest';
import { truncateDecimalPlaces } from './truncateDecimalPlaces';

describe('truncateDecimalPlaces', () => {
  it('handles string inputs', () => {
    expect(truncateDecimalPlaces('123.456', 2)).toBe('123.45');
    expect(truncateDecimalPlaces('0.123456', 4)).toBe('0.1234');
    expect(truncateDecimalPlaces('100', 2)).toBe('100');
  });

  it('handles number inputs', () => {
    expect(truncateDecimalPlaces(123.456, 2)).toBe('123.45');
    expect(truncateDecimalPlaces(0.123456, 4)).toBe('0.1234');
    expect(truncateDecimalPlaces(100, 2)).toBe('100');
  });

  it('handles edge cases', () => {
    expect(truncateDecimalPlaces('', 2)).toBe('');
    expect(truncateDecimalPlaces('.123', 2)).toBe('.12');
    expect(truncateDecimalPlaces(0, 2)).toBe('0');
    expect(truncateDecimalPlaces('.', 2)).toBe('.');
  });

  it('preserves trailing zeros if present in input string', () => {
    expect(truncateDecimalPlaces('123.450', 2)).toBe('123.45');
    expect(truncateDecimalPlaces('0.120', 3)).toBe('0.120');
  });

  it('handles negative numbers', () => {
    expect(truncateDecimalPlaces(-123.456, 2)).toBe('-123.45');
    expect(truncateDecimalPlaces('-0.123456', 4)).toBe('-0.1234');
  });
});
