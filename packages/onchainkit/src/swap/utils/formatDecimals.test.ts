import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment node
 */
import { formatDecimals } from './formatDecimals';

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
    expect(formatDecimals('1', true, 100)).toBe(`0.${'0'.repeat(99)}1`);
    expect(formatDecimals(`0.${'0'.repeat(99)}1`, false, 100)).toBe('1');
  });
});
