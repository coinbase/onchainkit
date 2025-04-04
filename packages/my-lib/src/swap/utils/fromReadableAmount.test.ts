import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import { fromReadableAmount } from './fromReadableAmount';

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
      '1000000000000000000000000000000000000',
    );
  });
});
