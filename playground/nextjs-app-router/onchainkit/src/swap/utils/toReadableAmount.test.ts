import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import { toReadableAmount } from './toReadableAmount';

describe('toReadableAmount', () => {
  it('converts whole numbers correctly', () => {
    expect(toReadableAmount('100000000000000000000', 18)).toBe('100');
    expect(toReadableAmount('1000000', 6)).toBe('1');
  });

  it('handles decimals correctly', () => {
    expect(toReadableAmount('1500000000000000000', 18)).toBe('1.5');
    expect(toReadableAmount('100000', 6)).toBe('0.1');
    expect(toReadableAmount('1.500001', 6)).toBe('1500001');
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
      '1000000000000000000',
    );
  });
});
