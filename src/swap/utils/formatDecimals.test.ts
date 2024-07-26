import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import {
  formatDecimals,
  fromReadableAmount,
  toReadableAmount,
} from './formatDecimals';

describe('fromReadableAmount', () => {
  it('converts whole numbers correctly', () => {
    expect(fromReadableAmount('100', 18)).toBe('100000000000000000000');
    expect(fromReadableAmount('1', 6)).toBe('1000000');
  });

  it('handles decimals correctly', () => {
    expect(fromReadableAmount('1.5', 18)).toBe('1500000000000000000');
    expect(fromReadableAmount('0.1', 6)).toBe('100000');
  });

  it('handles very small numbers', () => {
    expect(fromReadableAmount('0.000000000000000001', 18)).toBe('1');
    expect(fromReadableAmount('0.000001', 6)).toBe('1');
  });

  it('handles numbers with fewer digits than decimals', () => {
    expect(fromReadableAmount('0.1', 18)).toBe('100000000000000000');
    expect(fromReadableAmount('0.000001', 18)).toBe('1000000000000');
  });

  it('handles zero correctly', () => {
    expect(fromReadableAmount('0', 18)).toBe('0');
    expect(fromReadableAmount('0.0', 18)).toBe('0');
  });

  it('handles large numbers correctly', () => {
    expect(fromReadableAmount('1000000000000000000', 18)).toBe(
      '1000000000000000000000000000000000000'
    );
  });
});

describe('toReadableAmount', () => {
  it('converts whole numbers correctly', () => {
    expect(toReadableAmount('100000000000000000000', 18)).toBe('100');
    expect(toReadableAmount('1000000', 6)).toBe('1');
  });

  it('handles decimals correctly', () => {
    expect(toReadableAmount('1500000000000000000', 18)).toBe('1.5');
    expect(toReadableAmount('100000', 6)).toBe('0.1');
  });

  it('handles very small numbers', () => {
    expect(toReadableAmount('1', 18)).toBe('0.000000000000000001');
    expect(toReadableAmount('1', 6)).toBe('0.000001');
  });

  it('trims trailing zeros', () => {
    expect(toReadableAmount('1000000000000000000', 18)).toBe('1');
    expect(toReadableAmount('1500000', 6)).toBe('1.5');
  });

  it('handles zero correctly', () => {
    expect(toReadableAmount('0', 18)).toBe('0');
  });

  it('handles large numbers correctly', () => {
    expect(toReadableAmount('1000000000000000000000000000000000000', 18)).toBe(
      '1000000000000000000'
    );
  });
});

describe('formatDecimals', () => {
  it('formats input in decimals correctly', () => {
    expect(formatDecimals('1000000000000000000', true, 18)).toBe('1');
    expect(formatDecimals('1500000', true, 6)).toBe('1.5');
  });

  it('formats input not in decimals correctly', () => {
    expect(formatDecimals('1', false, 18)).toBe('1000000000000000000');
    expect(formatDecimals('1.5', false, 6)).toBe('1500000');
  });

  it('uses default 18 decimals when not specified', () => {
    expect(formatDecimals('1000000000000000000', true)).toBe('1');
    expect(formatDecimals('1', false)).toBe('1000000000000000000');
  });

  it('handles very small and very large numbers', () => {
    expect(formatDecimals('1', true, 18)).toBe('0.000000000000000001');
    expect(formatDecimals('0.000000000000000001', false, 18)).toBe('1');
  });

  it('handles zero decimal places', () => {
    expect(formatDecimals('1', true, 0)).toBe('1');
    expect(formatDecimals('1', false, 0)).toBe('1');
  });

  it('handles large number of decimal places', () => {
    expect(formatDecimals('1', true, 100)).toBe('0.' + '0'.repeat(99) + '1');
    expect(formatDecimals('0.' + '0'.repeat(99) + '1', false, 100)).toBe('1');
  });

  it('throws error for invalid input', () => {
    expect(() => formatDecimals('abc', true, 18)).toThrow();
    expect(() => formatDecimals('', false, 18)).toThrow();
  });
});
