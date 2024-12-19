import { describe, expect, test } from 'vitest';
import { truncateDecimalPlaces } from './truncateDecimalPlaces';

describe('truncateDecimalPlaces', () => {
  test('should limit to specified decimal places', () => {
    expect(truncateDecimalPlaces('123.4567', 2)).toBe('123.45');
  });

  test('should return original value if decimal places are less than or equal to specified', () => {
    expect(truncateDecimalPlaces('123.45', 2)).toBe('123.45');
  });

  test('should handle values without a decimal point', () => {
    expect(truncateDecimalPlaces('123', 2)).toBe('123');
  });

  test('should handle negative numbers', () => {
    expect(truncateDecimalPlaces('-123.4567', 3)).toBe('-123.456');
  });
});
